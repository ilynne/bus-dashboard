const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

const User = require('../models/user');
const Group = require('../models/group');

describe("/groups", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
  
    afterEach(testUtils.clearDB);

    const group0 = { name: "group0", origin: "Seattle", destination: "Portland" };
    const group1 = { name: "group1", origin: "New York", destination: "Boston", isDefault: true };
    const group2 = { name: "group2", origin: "Portland", destination: "Seattle" };
    const group3 = { name: "group3", origin: "Boston", destination: "New York", isDefault: true };

    describe('Before login', () => {
      describe('POST /', () => {
        it('should send 401 without a token', async () => {
          const res = await request(server).post("/groups").send(group0);
          expect(res.statusCode).toEqual(401);
        });
        it('should send 401 with a bad token', async () => {
          const res = await request(server)
            .post("/groups")
            .set('Authorization', 'Bearer BAD')
            .send(group0);
          expect(res.statusCode).toEqual(401);
        });
      });
      describe('GET /', () => {
        it('should send 401 without a token', async () => {
          const res = await request(server).get("/groups").send();
          expect(res.statusCode).toEqual(401);
        });
        it('should send 401 with a bad token', async () => {
          const res = await request(server)
            .get("/groups")
            .set('Authorization', 'Bearer BAD')
            .send();
          expect(res.statusCode).toEqual(401);
        });
      });
      describe('GET /:id', () => {
        it('should send 401 without a token', async () => {
          const res = await request(server).get("/groups/123").send();
          expect(res.statusCode).toEqual(401);
        });
        it('should send 401 with a bad token', async () => {
          const res = await request(server)
            .get("/groups/456")
            .set('Authorization', 'Bearer BAD')
            .send();
          expect(res.statusCode).toEqual(401);
        });
      });
      describe('PUT /:id', () => {
        it('should send 401 without a token', async () => {
          const res = await request(server).put("/groups/123").send();
          expect(res.statusCode).toEqual(401);
        });
        it('should send 401 with a bad token', async () => {
          const res = await request(server)
            .put("/groups/456")
            .set('Authorization', 'Bearer BAD')
            .send();
          expect(res.statusCode).toEqual(401);
        });
      });
      describe('DELETE /:id', () => {
        it('should send 401 without a token', async () => {
          const res = await request(server).delete("/groups/123").send();
          expect(res.statusCode).toEqual(401);
        });
        it('should send 401 with a bad token', async () => {
          const res = await request(server)
            .delete("/groups/456")
            .set('Authorization', 'Bearer BAD')
            .send();
          expect(res.statusCode).toEqual(401);
        });
      });
    });
    describe('after login', () => {
      const user0 = {
          email: 'user0@mail.com',
          password: '123password'
        };
        const user1 = {
          email: 'user1@mail.com',
          password: '456password'
        }
        let token0;
        let token1;
        beforeEach(async () => {
          await request(server).post("/login/signup").send(user0);
          const res0 = await request(server).post("/login").send(user0);
          token0 = res0.body.token;
          await request(server).post("/login/signup").send(user1);
          const res1 = await request(server).post("/login").send(user1);
          token1 = res1.body.token;
        });
        describe('POST /', () => {
          it('should send 200', async () => {
              const res = await request(server)
                .post("/groups")
                .set('Authorization', 'Bearer ' + token0)
                .send(group0);
              expect(res.statusCode).toEqual(200);
              expect(res.body).toMatchObject(group0)
            });
            it('should store group with userId for user0', async () => {
              await request(server)
                .post("/groups")
                .set('Authorization', 'Bearer ' + token0)
                .send(group0);
              const user = await User.findOne({email: user0.email}).lean();
              const savedGroup = await Group.findOne({ userId: user._id }).lean();
              expect(savedGroup).toMatchObject(group0);
            });
            it('should store group with userId for user1', async () => {
              await request(server)
                .post("/groups")
                .set('Authorization', 'Bearer ' + token1)
                .send(group1);
              const user = await User.findOne({email: user1.email}).lean();
              const savedGroup = await Group.findOne({ userId: user._id }).lean();
              expect(savedGroup).toMatchObject(group1);
            });
        });
        describe('GET /', () => {
          let user0Groups;
          let user1Groups;
          beforeEach(async () => {
            user0Groups = [
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group0)).body,
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group1)).body,
            ];
            user1Groups = [
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group2)).body,
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group3)).body,
            ];
          });
          it('should return user0 only their groups', async () => {
              const res = await request(server)
                .get("/groups")
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toEqual(user0Groups)
            });
            it('should return user1 only their groups', async () => {
              const res = await request(server)
                .get("/groups")
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toEqual(user1Groups)
            });
            it("should return multiple matching groups sorted by best score, for origin query", async () => {
              const searchTerm = 'Seattle'
              const res = await request(server)
                .get("/groups?origin=" + encodeURI(searchTerm))
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toMatchObject([
                user0Groups[0],
                user1Groups[0]
              ]);
            });
            it("should return multiple matching groups sorted by best score, for destination query", async () => {
              const searchTerm = 'Boston'
              const res = await request(server)
                .get("/groups?destination=" + encodeURI(searchTerm))
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toMatchObject([
                user0Groups[1],
                user1Groups[1]
              ]);
            });
            it("should return multiple matching groups sorted by best score, for origin & destination query", async () => {
              const searchTerm0 = 'Boston';
              const searchTerm1 = 'Seattle';
              const res = await request(server)
                .get("/groups?origin=" + encodeURI(searchTerm0) + "?destination=" + encodeURI(searchTerm1))
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toMatchObject([
                user0Groups[1],
                user1Groups[1],
                user0Groups[0],
                user1Groups[0]
              ]);
            });
        });
        describe('GET /:id', () => {
          let user0Groups;
          let user1Groups;
          beforeEach(async () => {
            user0Groups = [
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group0)).body,
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group1)).body,
            ];
            user1Groups = [
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group2)).body,
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group3)).body,
            ];
          });
          it.each([0, 1])('should return user0 group #%#', async (index) => {
              const group = user0Groups[index];
              const res = await request(server)
                .get("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toEqual(group);
            });
            it.each([0, 1])('should not return user0 group #%# from user1', async (index) => {
              const group = user1Groups[index];
              const res = await request(server)
                .get("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(404);
            });
            it.each([0, 1])('should return user1 group #%#', async (index) => {
              const group = user1Groups[index];
              const res = await request(server)
                .get("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(res.statusCode).toEqual(200);
              expect(res.body).toEqual(group);
            });
            it.each([0, 1])('should not return user1 group #%# from user0', async (index) => {
              const group = user0Groups[index];
              const res = await request(server)
                .get("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(res.statusCode).toEqual(404);
            });
        });
        describe('PUT /:id', () => {
          let user0Group;
          let user1Group;
          beforeEach(async () => {
            user0Groups = [
                (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group0)).body,
                (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group1)).body,
            ];
            user1Groups = [
                (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group2)).body,
                (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group3)).body,
            ];
          });
          it.each([0])('should update user0 group #%#', async (index) => {
              const group = user0Groups[index];
              const res = await request(server)
                .put("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send({ name: 'newName0' });
              expect(res.statusCode).toEqual(200);
              const storedGroup = (await request(server)
                .get("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send()).body;
              expect(storedGroup).toMatchObject({
                name: "newName0",
                origin: "Seattle",
                destination: "Portland",
                isDefault: false
              })
            });
            it.each([0, 1])('should not update user0 group #%# from user1', async (index) => {
              const group = user1Groups[index];
              const res = await request(server)
                .put("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(404);
            });
            it.each([0])('should update user1 group #%#', async (index) => {
              const group = user1Groups[index];
              const res = await request(server)
                .put("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send({ name: 'newName1', destination: 'newDestination' });
              expect(res.statusCode).toEqual(200);
              const storedGroup = (await request(server)
                .get("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send()).body;
              expect(storedGroup).toMatchObject({
                name: "newName1",
                origin: "Portland",
                destination: "newDestination",
                isDefault: false
              })
            });
            it.each([0, 1])('should not update user1 group #%# from user0', async (index) => {
              const group = user0Groups[index];
              const res = await request(server)
                .put("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(res.statusCode).toEqual(404);
            });
        });
        describe('DELETE /:id', () => {
          let user0Groups;
          let user1Groups;
          beforeEach(async () => {
            user0Groups = [
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group0)).body,
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group1)).body,
            ];
            user1Groups = [
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group2)).body,
              (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group3)).body,
            ];
          });
          it.each([0, 1])('should delete user0 group #%#', async (index) => {
              const group = user0Groups[index];
              const res = await request(server)
                .delete("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
            });
            it.each([0, 1])('should not allow user0 to delete group from user1', async (index) => {
              const group = user1Groups[index];
              const res = await request(server)
                .delete("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(404);
              const storedGroupResponse = (await request(server)
                  .get("/groups/" + group._id)
                  .set('Authorization', 'Bearer ' + token1)
                  .send());
              expect(storedGroupResponse.status).toEqual(200);
            });
            it.each([0, 1])('should delete user1 group #%#', async (index) => {
              const group = user1Groups[index];
              const res = await request(server)
                .delete("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(res.statusCode).toEqual(200);
            });
            it.each([0, 1])('should not allow user1 to delete group from user0', async (index) => {
              const group = user0Groups[index];
              const res = await request(server)
                .delete("/groups/" + group._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(res.statusCode).toEqual(404);
              const storedGroupResponse = (await request(server)
                  .get("/groups/" + group._id)
                  .set('Authorization', 'Bearer ' + token0)
                  .send());
              expect(storedGroupResponse.status).toEqual(200);
            });
        });
    });
});