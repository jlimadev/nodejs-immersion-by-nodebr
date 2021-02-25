const assert = require('assert');
const api = require('../api');

let app = {};

describe.only('Test to api hereoes', () => {
  before(async () => {
    app = await api;
  });

  describe('list', () => {
    it('Should list the heroes on /heroes', async () => {
      const result = await app.inject({
        method: 'GET',
        url: `/heroes`,
      });

      const { statusCode, payload } = result;

      const data = JSON.parse(payload);

      assert.strictEqual(statusCode, 200);
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

      assert.strictEqual(statusCode, 200);
      assert.ok(Array.isArray(data));
      assert.ok(data.length <= LIMIT);
    });

    it.only('Should return default values to skip and limit if they are empty or invalid', async () => {
      const LIMIT = 'ANYWRONG';
      const SKIP = 'ANYWRONG';
      const result = await app.inject({
        method: 'GET',
        url: `/heroes?skip=${SKIP}&limit=${LIMIT}`,
      });

      console.log(result);

      const { statusCode, statusMessage } = result;
      assert.strictEqual(statusCode, 200);
      assert.strictEqual(statusMessage, 'OK');
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

      assert.strictEqual(data[0].name, NAME);
      assert.strictEqual(statusCode, 200);
      assert.ok(Array.isArray(data));
    });
  });
});
