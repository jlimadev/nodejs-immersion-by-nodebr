const assert = require('assert');
const api = require('../api');

let app = {};
let refUUID = '';

const MOCK_CREATE_HERO = {
  name: 'Any Name',
  power: 'Any Power',
};

describe.only('Test to api hereoes', () => {
  before(async () => {
    app = await api;
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

      refUUID = payloadObject._id;
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

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, error, message } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(error === 'Bad Request');
      assert.ok(message === '"name" is required');
    });

    it('Should return 400 bad request if create a hero without a power', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { name: 'Any' },
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, error, message } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(error === 'Bad Request');
      assert.ok(message === '"power" is required');
    });

    it('Should return 400 bad request if create a hero with name with less than min size', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { name: 'A', power: 'Any Power' },
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, error, message } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(error === 'Bad Request');
      assert.ok(message === '"name" length must be at least 3 characters long');
    });

    it('Should return 400 bad request if create a hero with power with less than min size', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/heroes',
        payload: { name: 'Any', power: 'A' },
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, error, message } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(error === 'Bad Request');
      assert.ok(
        message === '"power" length must be at least 3 characters long',
      );
    });
  });

  describe('READ | GET', () => {
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

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, error, message } = payloadObject;

      assert.ok(statusCode === 400);
      assert.deepStrictEqual(error, 'Bad Request');
      assert.deepStrictEqual(message, '"skip" must be a number');
    });

    it('Should filter by name', async () => {
      const LIMIT = 10;
      const SKIP = 0;
      const NAME = 'Any Name';
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

  describe('UPDATE | PATCH', () => {
    it('Should update the hero power using the PATCH method in /heroes', async () => {
      const _id = refUUID;
      const patchObject = { power: 'Any Updated Power' };
      const expectedPayloadObject = { n: 1, nModified: 1, ok: 1 };

      const result = await app.inject({
        method: 'PATCH',
        url: `/heroes/${_id}`,
        payload: patchObject,
      });

      const { statusCode, statusMessage, payload } = result;
      const payloadObject = JSON.parse(payload);

      assert.ok(statusCode === 200);
      assert.ok(statusMessage === 'OK');
      assert.deepStrictEqual(payloadObject, expectedPayloadObject);
    });

    it('Should not update the hero with an unused id', async () => {
      const patchObject = { power: 'Any Updated Power' };
      const result = await app.inject({
        method: 'PATCH',
        url: `/heroes/invalidId`,
        payload: patchObject,
      });

      const { statusCode, statusMessage, payload } = result;
      const expectedPayloadObject = { n: 0, nModified: 0, ok: 1 };
      const payloadObject = JSON.parse(payload);

      assert.ok(statusCode === 200);
      assert.ok(statusMessage === 'OK');
      assert.deepStrictEqual(payloadObject, expectedPayloadObject);
    });

    it('Should return 400 bad request if update a hero without sending an ID', async () => {
      const patchObject = { power: 'Any Updated Power' };
      const result = await app.inject({
        method: 'PATCH',
        url: '/heroes',
        payload: patchObject,
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, statusMessage, error } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(error.message === '"id" is required');
    });

    it('Should return 400 bad request if update a hero with a invalid name size', async () => {
      const _id = 'any test id';
      const patchObject = { name: 'A' };
      const result = await app.inject({
        method: 'PATCH',
        url: `/heroes/${_id}`,
        payload: patchObject,
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, statusMessage, error } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(
        error.message === '"name" length must be at least 3 characters long',
      );
    });

    it('Should return 400 bad request if update a hero with a invalid power size', async () => {
      const _id = 'any test id';
      const patchObject = { power: 'A'.repeat(101) };
      const result = await app.inject({
        method: 'PATCH',
        url: `/heroes/${_id}`,
        payload: patchObject,
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, statusMessage, error } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.ok(
        error.message ===
          '"power" length must be less than or equal to 100 characters long',
      );
    });
  });

  describe('DELETE | DELETE', () => {
    it('Should delete a hero by ID using DELETE method', async () => {
      const _id = refUUID;
      const result = await app.inject({
        method: 'DELETE',
        url: `/heroes/${_id}`,
      });

      const expectedPayloadObject = { n: 1, ok: 1, deletedCount: 1 };

      const { statusCode, statusMessage, payload } = result;
      const payloadObject = JSON.parse(payload);

      assert.ok(statusCode === 200);
      assert.ok(statusMessage === 'OK');
      assert.deepStrictEqual(payloadObject, expectedPayloadObject);
    });

    it('Should delete all if id is not present', async () => {
      const createHeroes = Array(10).fill(MOCK_CREATE_HERO);

      /* With async map */
      const promises = createHeroes.map(async (hero) => {
        return await app.inject({
          method: 'POST',
          url: '/heroes',
          payload: hero,
        });
      });
      await Promise.all(promises);

      /* With async foreach */
      createHeroes.forEach(async (hero) => {
        await app.inject({
          method: 'POST',
          url: '/heroes',
          payload: hero,
        });
      });

      const result = await app.inject({
        method: 'DELETE',
        url: `/heroes`,
      });

      const expectedPayloadObject = { n: 20, ok: 1, deletedCount: 20 };

      const { statusCode, statusMessage, payload } = result;
      const payloadObject = JSON.parse(payload);

      assert.ok(statusCode === 200);
      assert.ok(statusMessage === 'OK');
      assert.deepStrictEqual(payloadObject, expectedPayloadObject);
    });

    it('Should fail when delete a hero with invalid UUID', async () => {
      const _id = 'refUUID';
      const result = await app.inject({
        method: 'DELETE',
        url: `/heroes/${_id}`,
      });

      const payloadObject = JSON.parse(result.payload);
      const { statusCode, statusMessage, error } = payloadObject;

      assert.ok(statusCode === 400);
      assert.ok(statusMessage === 'Bad Request');
      assert.deepStrictEqual(error.message, '"id" must be a valid GUID');
    });
  });
});
