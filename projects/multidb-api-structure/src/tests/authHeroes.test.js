const assert = require('assert');
const api = require('../api');
const Context = require('../db/strategies/base/contextStrategy');
const Postgres = require('../db/strategies/postgres/postgres');
const usersSchema = require('../db/strategies/postgres/schemas/usersSchema');
const mockedHash =
  '$2y$05$cmYIl0CILADBAhT/qNbtRuALzclb60uBVlJIc0ypJOBCNg/V56emK';

const DEFAULT_USER = {
  username: 'anyusername',
  password: 'anypassword',
};

const DAFAULT_USER_DB = {
  username: DEFAULT_USER.username.toLowerCase(),
  password: mockedHash,
};

let app = {};

describe.only('Auth test suit', () => {
  before(async () => {
    app = await api;

    const connection = await Postgres.connect();
    const model = await Postgres.defineModel(connection, usersSchema);
    const postgres = new Context(new Postgres(connection, model));
    await postgres.update(null, DAFAULT_USER_DB, true);
  });

  it('Should get a token when use the correct credentials', async () => {
    const result = await app.inject({
      method: 'POST',
      url: '/login',
      payload: DEFAULT_USER,
    });

    const { statusCode, statusMessage, payload } = result;
    const data = JSON.parse(payload);
    GENERATED_TOKEN = data.token;

    assert.ok(statusCode === 200);
    assert.ok(statusMessage === 'OK');
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
