const assert = require('assert');
const api = require('../api');

let app = {};
const MOCK_CREATE_HERO = { name: 'Any', power: 'Any Power' };

describe.only('Test to api hereoes', () => {
  before(async () => {
    app = await api;
  });

  describe.only('LIST | GET', () => {
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
      const NAME = 'Ruru';
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
});
