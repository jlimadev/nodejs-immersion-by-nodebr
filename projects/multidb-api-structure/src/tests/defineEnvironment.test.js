const assert = require('assert');
const defineEnvironment = require('../helpers/defineEnvironment');

describe.only('defineEnvironment test suit', () => {
  it('Should fail with correct message if environment is undefined', () => {
    const expectMessage =
      '[INVALID ENV] - undefined is invalid. The environment must be "devl" or "prod".';

    try {
      defineEnvironment();
    } catch (error) {
      assert.strictEqual(error.message, expectMessage);
    }
  });

  it('Should fail with correct message if environment is invalid', () => {
    const invalidEnv = 'anyInvalid';

    const expectMessage = `[INVALID ENV] - ${invalidEnv} is invalid. The environment must be "devl" or "prod".`;

    try {
      defineEnvironment(invalidEnv);
    } catch (error) {
      assert.strictEqual(error.message, expectMessage);
    }
  });

  it('Should throw an error if the environment is invalid', () => {
    const act = () => {
      defineEnvironment();
    };

    assert.throws(act, Error);
  });
});
