const assert = require('assert');
const api = require('../api');
let app = {};

describe.only('Auth test suit', () => {
  before(async () => {
    app = await api;
  });

  it('should get a token', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'anyusername',
        password: 'anypassword',
      },
    });

    const { statusCode, payload } = result;
    const data = JSON.parse(payload);

    assert.ok(statusCode === 200);
    assert.ok(data.token.length > 10);
  });
});
