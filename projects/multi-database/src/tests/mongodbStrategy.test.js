const Mongodb = require('../db/strategies/mongodb');
const Context = require('../db/strategies/base/contextStrategy');
const { deepStrictEqual, match } = require('assert');

const context = new Context(new Mongodb());
const MOCK_HERO = { name: 'Ruru', power: 'Gordin' };
let REF_ID = '';

describe.only('Mongodb Strategy', () => {
  before(async () => {
    await context.connect();
    const createdHero = await context.create(MOCK_HERO);
    REF_ID = createdHero._id;
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
  it('Should DELETE from mongodb', async () => {});
});
