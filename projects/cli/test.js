const { deepStrictEqual } = require('assert');
const database = require('./database');

const DEFAULT_ITEM = { id: 1, name: 'anyHero', power: 'anyPower' };

describe('Manupulation of Heroes', () => {
  before(async () => {
    await database.add(DEFAULT_ITEM);
  });

  it('should search a hero using a file', async () => {
    const expectedResponse = DEFAULT_ITEM;
    const [firstResponse] = await database.get();

    deepStrictEqual(firstResponse, expectedResponse);
  });

  it('should add a hero using files', async () => {
    const expectedResponse = DEFAULT_ITEM;

    await database.add(expectedResponse);
    const [current] = await database.get(expectedResponse.id);
    deepStrictEqual(current, expectedResponse);
  });

  it('should update the hero data by id', async () => {
    const newBody = { name: 'newName', power: 'newPower' };
    const expectedResponse = { id: 1, name: 'newName', power: 'newPower' };
    const result = await database.update(DEFAULT_ITEM.id, newBody);
    const [changeResult] = await database.get(DEFAULT_ITEM.id);

    deepStrictEqual(true, result);
    deepStrictEqual(changeResult, expectedResponse);
  });

  it('should remove a hero by id', async () => {
    const expected = true;
    const result = await database.delete();

    deepStrictEqual(expected, result);
  });
});
