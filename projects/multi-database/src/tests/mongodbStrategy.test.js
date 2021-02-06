const Mongodb = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');
const { deepStrictEqual, match } = require('assert');

const context = new Context(new Mongodb());
const MOCK_HERO = { name: 'Ruru', power: 'Gordin' };

describe.only('Mongodb Strategy', () => {
  before(async () => {
    await context.connect();
  });

  it('Should Check the connection and return connected to mongodb', async () => {
    const result = await context.isConnected();
    const expected = 'connected';
    deepStrictEqual(result, expected);
  });

  it('Should CREATE a hero in the mongodb', async () => {
    const { name, power } = await context.create(MOCK_HERO);
    const responseBody = { name, power };
    deepStrictEqual(responseBody, MOCK_HERO);
  });
  it('Should READ from mongodb', async () => {});
  it('Should UPDATE from mongodb', async () => {});
  it('Should DELETE from mongodb', async () => {});
});
