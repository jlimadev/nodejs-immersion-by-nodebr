const Postgres = require('../db/strategies/postgres');
const Context = require('../db/strategies/base/contextStrategy');
const { deepStrictEqual } = require('assert');

const context = new Context(new Postgres());
const MOCK_HERO = { name: 'Ruru', power: 'Gordin' };

describe('Postgres Srategy', () => {
  before(async () => {
    await context.connect();
    await context.delete();
    await context.create(MOCK_HERO);
  });

  it('Should connect to postgres database (isConnected)', async () => {
    const result = await context.isConnected();
    deepStrictEqual(result, true);
  });

  it('Should CREATE a hero in the database', async () => {
    const result = await context.create(MOCK_HERO);

    const expectedBody = MOCK_HERO;
    const expectedKeys = ['id', 'name', 'power'];

    const responseBody = { name: result.name, power: result.power };
    const responseKeys = Object.keys(result);

    deepStrictEqual(responseBody, expectedBody);
    deepStrictEqual(responseKeys, expectedKeys);
  });

  it('Should READ by <CRITERIA> from postgres database', async () => {
    const [result] = await context.read({ name: MOCK_HERO.name });
    const responseBody = { name: result.name, power: result.power };
    deepStrictEqual(responseBody, MOCK_HERO);
  });

  it('Should UPDATE by <ID> from postgres database', async () => {
    const newItem = { ...MOCK_HERO, power: 'So much more Gordin' };

    // get the id to update
    const [itemToUpdate] = await context.read({ name: MOCK_HERO.name });
    const id = itemToUpdate.id;

    // updating the item
    const [result] = await context.update(newItem, id);

    // getting the updated item to assert
    const [updatedItem] = await context.read({ id: id });
    const updatedResponseBody = {
      name: updatedItem.name,
      power: updatedItem.power,
    };

    deepStrictEqual(result, 1);
    deepStrictEqual(newItem, updatedResponseBody);
  });

  it('Should DELETE by <ID> from postgres database', async () => {
    const [itemToDelete] = await context.read({ name: MOCK_HERO.name });
    const result = await context.delete(itemToDelete.id);
    deepStrictEqual(result, 1);
  });
});
