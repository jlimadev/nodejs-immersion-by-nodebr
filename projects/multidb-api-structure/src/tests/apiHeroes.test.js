const assert = require('assert');
const api = require('../api');

let app = {};

describe.only('Test to api hereoes', () => {
  before(async () => {
    app = await api;
  });

  it('Should list the heroes on /heroes', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/heroes',
    });

    const { statusCode, payload } = result;

    const data = JSON.parse(payload);

    assert.strictEqual(statusCode, 200);
    assert.ok(Array.isArray(data));
  });
});
