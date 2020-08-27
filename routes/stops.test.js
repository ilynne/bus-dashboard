const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/stops", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
  
    afterEach(testUtils.clearDB);

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
        beforeEach(async () => {
            await request(server).post("/login/signup").send(user0);
            const res0 = await request(server).post("/login").send(user0);
            token0 = res0.body.token;
            await request(server).post("/login/signup").send(user1);
            const res1 = await request(server).post("/login").send(user1);
            token1 = res1.body.token;
        });
        // to complete below here!
    });
});