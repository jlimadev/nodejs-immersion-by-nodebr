const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');
const assert = require('assert');

const context = new Context(new Postgres());

describe('Postgres Srategy', () => {
  it('Should connect to postgres database', async () => {
    const result = await context.isConnected();
    assert.deepStrictEqual(result, true);
  });
});
