const request = require("supertest");

const server = require("../server");
const testUtils = require('../test-utils');

describe("/", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);
  
    afterEach(testUtils.clearDB);

    // to complete

});