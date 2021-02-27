const assert = require('assert');
const api = require('../api');

let app = {};
const MOCK_CREATE_HERO = { name: 'Any', power: 'Any Power' };

describe.only('Test to api hereoes', () => {
  before(async () => {
    app = await api;
  });

  describe('LIST | GET', () => {
    it('Should list the heroes using GET on /heroes', async () => {
      const result = await app.inject({
        method: 'GET',
        url: `/heroes`,
      });

      const { statusCode, payload } = result;
      const data = JSON.parse(payload);

      assert.ok(statusCode === 200);
      assert.ok(Array.isArray(data));
    });

    it('Should return <= 10 items from database', async () => {
      const LIMIT = 10;
      const SKIP = 0;
      const result = await app.inject({
        method: 'GET',
        url: `/heroes?skip=${SKIP}&limit=${LIMIT}`,
      });

      const { statusCode, payload } = result;
      const data = JSON.parse(payload);

      assert.ok(statusCode === 200);
      assert.ok(Array.isArray(data));
      assert.ok(data.length <= LIMIT);
    });

    it('Should fail if skip and limit if they invalid', async () => {
      const LIMIT = 'ANYWRONG';
      const SKIP = 'ANYWRONG';
      const result = await app.inject({
        method: 'GET',
        url: `/heroes?skip=${SKIP}&limit=${LIMIT}`,
      });

      const {
        result: { statusCode, statusMessage, error },
      } = result;

      assert.ok(statusCode === 400);
      assert.deepStrictEqual(statusMessage, 'Bad Request');
      assert.deepStrictEqual(error.message, '"skip" must be a number');
    });

    it('Should filter by name', async () => {
      const LIMIT = 10;
      const SKIP = 0;
      const NAME = 'Any';
      const result = await app.inject({
        method: 'GET',
        url: `/heroes?skip=${SKIP}&limit=${LIMIT}&name=${NAME}`,
      });

      const { statusCode, payload } = result;
      const data = JSON.parse(payload);

      assert.deepStrictEqual(data[0].name, NAME);
      assert.deepStrictEqual(statusCode, 200);
      assert.ok(Array.isArray(data));
    });
  });

  describe('CREATE | POST', () => {
    it('should create a new hero in database using POST method in /heroes', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: MOCK_CREATE_HERO,
      });

      const { statusCode, statusMessage, payload } = result;
      const payloadObject = JSON.parse(payload);

      console.log('create _id', payloadObject._id);

      const expectedKeys = ['createdAt', 'name', 'power', '_id', '__v'];
      const resultKeys = Object.keys(payloadObject);

      assert.ok(statusCode === 200);
      assert.ok(statusMessage === 'OK');
      assert.deepStrictEqual(resultKeys, expectedKeys);
    });

    it('Should return 400 bad request if create a hero without a name', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { power: 'Any Power' },
      });

      const {
        result: { statusCode, statusMessage, error },
      } = result;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(error.message === '"name" is required');
    });

    it('Should return 400 bad request if create a hero without a power', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { name: 'Any' },
      });

      const {
        result: { statusCode, statusMessage, error },
      } = result;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(error.message === '"power" is required');
    });

    it('Should return 400 bad request if create a hero with name with less than min size', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { name: 'A', power: 'Any Power' },
      });

      const {
        result: { statusCode, statusMessage, error },
      } = result;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(
        error.message === '"name" length must be at least 3 characters long',
      );
    });

    it('Should return 400 bad request if create a hero with power with less than min size', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { name: 'Any', power: 'A' },
      });

      const {
        result: { statusCode, statusMessage, error },
      } = result;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(
        error.message === '"power" length must be at least 3 characters long',
      );
    });
  });
});
