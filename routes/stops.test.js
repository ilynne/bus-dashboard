const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/stops", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
  
    afterEach(testUtils.clearDB);

    const group0 = { name: "group0", origin: "Seattle", destination: "Portland" };
    const group1 = { name: "group1", origin: "New York", destination: "Boston" };

    describe('Before login', () => {
        describe('POST /', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).post("/stops").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .post("/stops")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('GET /', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).get("/stops").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .get("/stops")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('GET /:id', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).get("/stops/123").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .get("/stops/456")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('PUT /:id', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).put("/stops/123").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .put("/stops/456")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('DELETE /:id', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).delete("/stops/123").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .delete("/stops/456")
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
        let user0Group;
        let user1Group;
        let stop0;
        let stop1;
        beforeEach(async () => {
            await request(server).post("/login/signup").send(user0);
            const res0 = await request(server).post("/login").send(user0);
            token0 = res0.body.token;
            await request(server).post("/login/signup").send(user1);
            const res1 = await request(server).post("/login").send(user1);
            token1 = res1.body.token;

            user0Group = (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group0)).body;
            user1Group = (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group1)).body;

            stop0 = { groupId: `${user0Group._id}`, stopId: "3rdAveAndPike"};
            stop1 = { groupId: `${user1Group._id}`, stopId: "3rdAveAndPike"};
        });
        describe('POST /', () => {
          it('allows the same stopId for different groups', async () => {
            const res = await request(server)
              .post("/stops")
              .set('Authorization', 'Bearer ' + token0)
              .send(stop0);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(stop0);
            const res2 = await request(server)
              .post("/stops")
              .set('Authorization', 'Bearer ' + token1)
              .send(stop1);
            expect(res2.statusCode).toEqual(200);
            expect(res2.body).toMatchObject(stop1);
          });
          it('it does not allow a duplicate stopIds for the same group', async () => {
            const res = await request(server)
              .post("/stops")
              .set('Authorization', 'Bearer ' + token0)
              .send(stop0);
            expect(res.statusCode).toEqual(200);
            expect(res.body).toMatchObject(stop0);
            const res2 = await request(server)
              .post("/stops")
              .set('Authorization', 'Bearer ' + token0)
              .send(stop0);
            expect(res2.statusCode).toEqual(409);
          });
        });
        describe('GET /', () => {
          let user0Stop;
          let user1Stop;
          beforeEach(async () => {
            user0Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token0).send(stop0)).body;
            user1Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token1).send(stop1)).body;
          });
          it('should get a stop via the groupId query', async () => {
            const searchTerm = user0Group._id;
            const res = await request(server)
              .get("/stops?groupId=" + encodeURI(searchTerm))
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([user0Stop]);
          });
          it('should get all stops', async () => {
            const res = await request(server)
              .get("/stops")
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([
              user0Stop,
              user1Stop
            ]);
          });
        });
        describe('GET /:id', () => {
          let user0Stop;
          let user1Stop;
          beforeEach(async () => {
            user0Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token0).send(stop0)).body;
            user1Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token1).send(stop1)).body;
          });
          it('should return 400 with a bad id', async () => {
            const res = await request(server)
              .get("/stops/123")
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(res.statusCode).toEqual(400);
          });
          it('should return user0Stop but not user1Stop', async () => {
            const res = await request(server)
              .get("/stops/" + user0Stop._id)
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(res.status).toEqual(200);
            expect(res.body).toEqual(user0Stop);
          });
        });
        describe('PUT /:id', () => {
          let user0Stop;
          let user1Stop;
          beforeEach(async () => {
            user0Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token0).send(stop0)).body;
            user1Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token1).send(stop1)).body;
          });
          it('should return 400 with a bad id', async () => {
            const res = await request(server)
              .put("/stops/123")
              .set('Authorization', 'Bearer ' + token0)
              .send({stopId: "newStop"});
            expect(res.statusCode).toEqual(400);
          });
          it('should update user0Stop but not user1Stop', async () => {
            const res = await request(server)
              .put("/stops/" + user0Stop._id)
              .set('Authorization', 'Bearer ' + token0)
              .send({stopId: "newStop"});
            expect(res.status).toEqual(200);
            const storedUser0Stop = (await request(server)
              .get("/stops/" + user0Stop._id)
              .set('Authorization', 'Bearer ' + token0)
              .send()).body;
            expect(storedUser0Stop).toMatchObject({
              groupId: user0Group._id,
              stopId: "newStop"
            });
          });
        });
        describe('DELETE /:id', () => {
          let user0Stop;
          let user1Stop;
          beforeEach(async () => {
            user0Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token0).send(stop0)).body;
            user1Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token1).send(stop1)).body;
          });
          it('should return 400 with a bad id', async () => {
            const res = await request(server)
              .delete("/stops/123")
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(res.statusCode).toEqual(400);
          });
          it('should delete user0Stop but not user1Stop', async () => {
            const res = await request(server)
              .delete("/stops/" + user0Stop._id)
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(res.statusCode).toEqual(200);
            const storedStopResponse = await request(server)
              .get("/stops/" + user0Stop._id)
              .set('Authorization', 'Bearer ' + token0)
              .send();
            expect(storedStopResponse.status).toEqual(404);
            const storedUser1Stop = await request(server)
              .get("/stops/" + user1Stop._id)
              .set('Authorization', 'Bearer ' + token1)
              .send();
            expect(storedUser1Stop.status).toEqual(200);
            expect(storedUser1Stop.body).toEqual(user1Stop);
          });
        });
    });
});