const { deepStrictEqual, ok } = require('assert');
const database = require('./database');

const DEFAULT_ITEM = { id: 1, name: 'anyHero', power: 'anyPower' };

describe('Manupulation of Heroes', () => {
  before(async () => {
    await database.register(DEFAULT_ITEM);
  });

  it('should search a hero using a file', async () => {
    const expectedResponse = DEFAULT_ITEM;
    const [firstResponse] = await database.get();

    deepStrictEqual(firstResponse, expectedResponse);
  });

  it('should register a hero using files', async () => {
    const expectedResponse = DEFAULT_ITEM;

    await database.register(expectedResponse);
    const [current] = await database.get(expectedResponse.id);
    deepStrictEqual(current, expectedResponse);
  });

  it('should remove a hero by id', async () => {
    const expectedResponse = DEFAULT_ITEM;
    const expected = true;
    const result = await database.delete(expectedResponse.id);

    deepStrictEqual(expected, result);
  });
});
