const { deepStrictEqual, ok } = require('assert');
const database = require('./database');

const DEFAULT_ITEM = { id: 1, name: 'flash', power: 'speed' };

describe('Manupulation of Heroes', () => {
  it('should search a hero using a file', async () => {
    const expectedResponse = DEFAULT_ITEM;
    const [result] = await database.get();

    deepStrictEqual(result, expectedResponse);
  });

  it('should register a hero using files', async () => {
    const expectedResponse = DEFAULT_ITEM;
    ok(expectedResponse, expectedResponse);
  });
});
