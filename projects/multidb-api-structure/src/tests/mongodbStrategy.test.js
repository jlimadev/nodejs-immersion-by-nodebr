const MongoDb = require('../db/strategies/mongodb/mongodb');
const Context = require('../db/strategies/base/contextStrategy');
const HeroesSchema = require('../db/strategies/mongodb/schemas/heroesSchema');
const { deepStrictEqual } = require('assert');

const MOCK_HERO = { name: 'Ruru', power: 'Gordin' };
let context = {};
let REF_ID = '';

describe('Mongodb Strategy', () => {
  before(async () => {
    const connection = MongoDb.connect();
    context = new Context(new MongoDb(connection, HeroesSchema));

    await context.delete();
  });

  after(async () => {
    const result = await context.isConnected();
    console.log('CONNECTION_STATUS', result);
    MongoDb.disconnect();
  });

  it('Should Check the connection and return connected to mongodb', async () => {
    const result = await context.isConnected();
    const expected = 'connected';
    deepStrictEqual(result, expected);
  });

  it('Should CREATE a hero in the mongodb', async () => {
    const { _id, name, power } = await context.create(MOCK_HERO);
    REF_ID = _id;
    const responseBody = { name, power };
    deepStrictEqual(responseBody, MOCK_HERO);
  });

  it('Should READ from mongodb', async () => {
    const [{ name, power }] = await context.read({ name: MOCK_HERO.name });
    const responseBody = { name, power };
    deepStrictEqual(responseBody, MOCK_HERO);
  });

  it('Should UPDATE from mongodb', async () => {
    const newPower = 'So much more Gordin';
    const newItem = { ...MOCK_HERO, power: newPower };

    const result = await context.update(REF_ID, newItem);
    const [{ power }] = await context.read({ _id: REF_ID });

    deepStrictEqual(result.nModified, 1);
    deepStrictEqual(power, newPower);
  });

  it('Should DELETE from mongodb', async () => {
    const result = await context.delete(REF_ID);

    deepStrictEqual(result.n, 1);
  });
});
