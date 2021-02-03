const { deepStrictEqual, ok } = require('assert');
const database = require('./database');
const { v4 } = require('uuid');

const id = v4();
const DEFAULT_ITEM = { id: 1, name: 'anyHero', power: 'anyPower' };

describe('Manupulation of Heroes', () => {
  before(async () => {});
  it('should search a hero using a file', async () => {
    const expectedResponse = DEFAULT_ITEM;
    const [firstResponse] = await database.get();

    deepStrictEqual(firstResponse, expectedResponse);
  });

  it('should register a hero using files', async () => {
    const expectedId = v4();

    const expectedRegisterItem = {
      id: expectedId,
      name: DEFAULT_ITEM.name,
      power: DEFAULT_ITEM.power,
    };

    await database.register(expectedRegisterItem);
    const [current] = await database.get(expectedId);
    deepStrictEqual(current, expectedRegisterItem);
  });
});
