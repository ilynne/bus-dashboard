const request = require("supertest");

const server = require("../server");

const testUtils = require('../test-utils');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn());
fetch.mockReturnValue(Promise.resolve({}));

describe("/oba", () => {
  beforeAll(testUtils.connectDB);
  afterAll(testUtils.stopDB);

  afterEach(testUtils.clearDB);

  describe('Before login', () => {
    describe('GET /routes/:id', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/oba/routes/1").send();
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/oba/routes/1")
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('GET /routes/:id/stops', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/oba/routes/1/stops").send();
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/oba/routes/1/stops")
          .set('Authorization', 'Bearer BAD')
          .send();
        expect(res.statusCode).toEqual(401);
      });
    });
    describe('GET /stops/:id/arrivals', () => {
      it('should send 401 without a token', async () => {
        const res = await request(server).get("/oba/stops/1/arrivals").send();
        expect(res.statusCode).toEqual(401);
      });
      it('should send 401 with a bad token', async () => {
        const res = await request(server)
          .get("/oba/stops/1/arrivals")
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
    const oneBusAwayBaseUri = 'http://api.pugetsound.onebusaway.org/api/where';
    let token;
    beforeEach(async () => {
      await request(server).post("/login/signup").send(user0);
      const res = await request(server).post("/login").send(user0);
      token = res.body.token;
      fetch.mockClear();
    });
    describe('GET /routes/:id', () => {
      const agencyId = '5';
      it('should send 200', async () => {
        const res = await request(server)
          .get(`/oba/routes/${agencyId}`)
          .set('Authorization', 'Bearer ' + token)
        expect(res.statusCode).toEqual(200);
      });
      it('should send a request to the expected one bus away API', async () => {
        const expectedRequest = `${oneBusAwayBaseUri}/routes-for-agency/${agencyId}.json?key=${process.env.ONE_BUS_AWAY_API_KEY}`
        const res = await request(server)
          .get(`/oba/routes/${agencyId}`)
          .set('Authorization', 'Bearer ' + token)
        expect(fetch.mock.calls[0][0]).toBe(expectedRequest);
      });
    });
    describe('GET /routes/:id/stops', () => {
      const routeId = '9';
      it('should send 200', async () => {
        const res = await request(server)
          .get(`/oba/routes/${routeId}/stops`)
          .set('Authorization', 'Bearer ' + token)
        expect(res.statusCode).toEqual(200);
      });
      it('should send a request to the expected one bus away API', async () => {
        const expectedRequest = `${oneBusAwayBaseUri}/stops-for-route/${routeId}.json?key=${process.env.ONE_BUS_AWAY_API_KEY}`
        const res = await request(server)
          .get(`/oba/routes/${routeId}/stops`)
          .set('Authorization', 'Bearer ' + token)
        expect(fetch.mock.calls[0][0]).toBe(expectedRequest);
      });
    });
    describe('GET /stops/:id/arrivals', () => {
      const stopId = '3';
      it('should send 200', async () => {
        const res = await request(server)
          .get(`/oba/stops/${stopId}/arrivals`)
          .set('Authorization', 'Bearer ' + token)
        expect(res.statusCode).toEqual(200);
      });
      it('should send a request to the expected one bus away API', async () => {
        const expectedRequest = `${oneBusAwayBaseUri}/arrivals-and-departures-for-stop/${stopId}.json?key=${process.env.ONE_BUS_AWAY_API_KEY}`
        const res = await request(server)
          .get(`/oba/stops/${stopId}/arrivals`)
          .set('Authorization', 'Bearer ' + token)
        expect(fetch.mock.calls[0][0]).toBe(expectedRequest);
      });
    });
  });
});
