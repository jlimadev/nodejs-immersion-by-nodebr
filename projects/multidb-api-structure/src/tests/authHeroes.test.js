const assert = require('assert');
const api = require('../api');
let app = {};

describe('Auth test suit', () => {
  before(async () => {
    app = await api;
  });

  it('Should get a token when use the correct credentials', async () => {
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
    GENERATED_TOKEN = data.token;

    assert.ok(statusCode === 200);
    assert.ok(data.token.length > 10);
  });

  it('Should not get a token when use the incorrect credentials', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: {
        username: 'invalid',
        password: 'invalid',
      },
    });

    const payloadObject = JSON.parse(result.payload);
    const { statusCode, error, message } = payloadObject;

    assert.ok(statusCode === 401);
    assert.ok(error === 'Unauthorized');
    assert.deepStrictEqual(message, 'Invalid username or password');
  });
});
