const assert = require('assert');
const PasswordHelper = require('../helpers/PasswordHelper');

const PASSWORD = 'SUPERBIGPASS';
let generatedHash = '';

describe('Password helper test suit', () => {
  it('Should generate a hash starting from a password', async () => {
    const result = await PasswordHelper.hashPassword(PASSWORD);
    generatedHash = result;
    assert.ok(result.length > 10);
  });

  it('Should validate the hash of a password', async () => {
    const result = await PasswordHelper.comparePassword(
      PASSWORD,
      generatedHash,
    );
    assert.ok(result);
  });
});
