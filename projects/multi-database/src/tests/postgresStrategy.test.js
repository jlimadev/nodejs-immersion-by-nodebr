const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');
const { deepStrictEqual } = require('assert');

const context = new Context(new Postgres());
const MOCK_HERO = { name: 'Ruru', power: 'Gordin' };

describe('Postgres Srategy', () => {
  before(async () => {
    await context.connect();
  });

  it('Should connect to postgres database (isConnected)', async () => {
    const result = await context.isConnected();
    deepStrictEqual(result, true);
  });

  it('Should register a hero in the database', async () => {
    const expectedBody = MOCK_HERO;
    const expectedKeys = ['id', 'name', 'power'];

    const result = await context.create(MOCK_HERO);

    const responseBody = { name: result.name, power: result.power };
    const responseKeys = Object.keys(result);

    deepStrictEqual(responseBody, expectedBody);
    deepStrictEqual(responseKeys, expectedKeys);
  });
});
