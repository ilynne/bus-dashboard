const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/buses", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);

    afterEach(testUtils.clearDB);

    describe('Before login', () => {
        describe('POST /', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).post("/buses").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .post("/buses")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('GET /', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).get("/buses").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .get("/buses")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('GET /:id', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).get("/buses/123").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .get("/buses/456")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('PUT /:id', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).put("/buses/123").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .put("/buses/456")
              .set('Authorization', 'Bearer BAD')
              .send();
            expect(res.statusCode).toEqual(401);
          });
        });
        describe('DELETE /:id', () => {
          it('should send 401 without a token', async () => {
            const res = await request(server).delete("/buses/123").send();
            expect(res.statusCode).toEqual(401);
          });
          it('should send 401 with a bad token', async () => {
            const res = await request(server)
              .delete("/buses/456")
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
        };
        const group0 = {
            name: "group0",
            origin: "Seattle",
            destination: "Portland"
        };
        const group1 = {
            name: "group1",
            origin: "New York",
            destination: "Boston"
        };

        let token0;
        let token1;

        let user0Group;
        let user1Group;

        let stop0;
        let stop01;
        let stop1;
        let stop11;

        let user0Stop;
        let user0Stop1;
        let user1Stop;
        let user1Stop1;
        beforeEach(async () => {
            await request(server).post("/login/signup").send(user0);
            const res0 = await request(server).post("/login").send(user0);
            token0 = res0.body.token;
            await request(server).post("/login/signup").send(user1);
            const res1 = await request(server).post("/login").send(user1);
            token1 = res1.body.token;

            user0Group = (await request(server).post("/groups").set('Authorization', 'Bearer ' + token0).send(group0)).body;
            user1Group = (await request(server).post("/groups").set('Authorization', 'Bearer ' + token1).send(group1)).body;

            stop0 = {
                groupId: `${user0Group._id}`,
                stopId: "3rdAveAndPike",
                busId: "1_000235"
            };
            stop1 = {
                groupId: `${user1Group._id}`,
                stopId: "3rdAveAndBell",
                busId: "1_000235"
            };

            user0Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token0).send(stop0)).body;
            user1Stop = (await request(server).post("/stops").set('Authorization', 'Bearer ' + token1).send(stop1)).body;

            bus0 = {
                stopId: `${user0Stop._id}`,
                busId: "Route44"
            };
            bus1 = {
                stopId: `${user1Stop._id}`,
                busId: "Route44"
            };
        });
        describe('POST /', () => {
            it('allows the same busId for different stops', async () => {
                const res = await request(server)
                .post("/buses")
                .set('Authorization', 'Bearer ' + token0)
                .send(bus0);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject(bus0);
                const res2 = await request(server)
                .post("/buses")
                .set('Authorization', 'Bearer ' + token1)
                .send(bus1);
                expect(res2.statusCode).toEqual(200);
                expect(res2.body).toMatchObject(bus1);
            });
            it('it does not allow a duplicate busIds for the same stop', async () => {
                const res = await request(server)
                .post("/buses")
                .set('Authorization', 'Bearer ' + token0)
                .send(bus0);
                expect(res.statusCode).toEqual(200);
                expect(res.body).toMatchObject(bus0);
                const res2 = await request(server)
                .post("/buses")
                .set('Authorization', 'Bearer ' + token0)
                .send(bus0);
                expect(res2.statusCode).toEqual(409);
            });
        });
        describe('GET /', () => {

            beforeEach(async () => {
                user0Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token0).send(bus0)).body;
                user1Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token1).send(bus1)).body;
            });
            it('should get a bus via the stopId query', async () => {
                const searchTerm = user0Stop._id;
                const res = await request(server)
                .get("/buses?stopId=" + encodeURI(searchTerm))
                .set('Authorization', 'Bearer ' + token0)
                .send();
                expect(res.statusCode).toEqual(200);
                expect(res.body).toEqual([user0Bus]);
            });
            // this will need fine tuning:
            it('should get buses based on stopId and groupId query', async () => {
              const stopIdParam = "3rdAveAndPike";
              const groupIdParam = user0Group._id;
              const res = await request(server)
                .get("/buses?stopId=" + encodeURI(stopIdParam) + "&groupId=" + encodeURI(groupIdParam))
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              // expect(res.body).toEqual([user0Bus]);
            })
            it('should get all buses in order of creation', async () => {
                const res = await request(server)
                .get("/buses")
                .set('Authorization', 'Bearer ' + token0)
                .send();
                expect(res.statusCode).toEqual(200);
                expect(res.body).toEqual([
                    user0Bus,
                    user1Bus
                ]);
            });
        });
        describe('GET /:id', () => {
            let user0Bus;
            let user1Bus;
            beforeEach(async () => {
                user0Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token0).send(bus0)).body;
                user1Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token1).send(bus1)).body;
            });
            it('should return 400 with a bad id', async () => {
              const res = await request(server)
                .get("/buses/123")
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(400);
            });
            it('should return user0Bus but not user1Bus', async () => {
              const res = await request(server)
                .get("/buses/" + user0Bus._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.status).toEqual(200);
              expect(res.body).toEqual(user0Bus);
            });
        });
        describe('PUT /:id', () => {
            let user0Bus;
            let user1Bus;
            beforeEach(async () => {
                user0Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token0).send(bus0)).body;
                user1Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token1).send(bus1)).body;
            });
            it('should return 400 with a bad id', async () => {
              const res = await request(server)
                .put("/buses/123")
                .set('Authorization', 'Bearer ' + token0)
                .send({busId: "newBus"});
              expect(res.statusCode).toEqual(400);
            });
            it('should update user0Bus but not user1Bus', async () => {
              const res = await request(server)
                .put("/buses/" + user0Bus._id)
                .set('Authorization', 'Bearer ' + token0)
                .send({busId: "newBus"});
              expect(res.status).toEqual(200);
              const storedUser0Bus = (await request(server)
                .get("/buses/" + user0Bus._id)
                .set('Authorization', 'Bearer ' + token0)
                .send()).body;
              expect(storedUser0Bus).toMatchObject({
                stopId: user0Stop._id,
                busId: "newBus"
              });
              const storedUser1Bus = await request(server)
                .get("/buses/" + user1Bus._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(storedUser1Bus.status).toEqual(200);
              expect(storedUser1Bus.body).toEqual(user1Bus);
            });
        });
        describe('DELETE /:id', () => {
            let user0Bus;
            let user1Bus;
            beforeEach(async () => {
                user0Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token0).send(bus0)).body;
                user1Bus = (await request(server).post("/buses").set('Authorization', 'Bearer ' + token1).send(bus1)).body;
            });
            it('should return 400 with a bad id', async () => {
              const res = await request(server)
                .delete("/buses/123")
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(400);
            });
            it('should delete user0Bus but not user1Bus', async () => {
              const res = await request(server)
                .delete("/buses/" + user0Bus._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(res.statusCode).toEqual(200);
              const storedBusResponse = await request(server)
                .get("/buses/" + user0Bus._id)
                .set('Authorization', 'Bearer ' + token0)
                .send();
              expect(storedBusResponse.status).toEqual(404);
              const storedUser1Bus = await request(server)
                .get("/buses/" + user1Bus._id)
                .set('Authorization', 'Bearer ' + token1)
                .send();
              expect(storedUser1Bus.status).toEqual(200);
              expect(storedUser1Bus.body).toEqual(user1Bus);
            });
        });
    });
});
