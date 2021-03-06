const assert = require('assert');
const defineEnvironment = require('../helpers/defineEnvironment');

describe('defineEnvironment test suit', () => {
  describe('Invalid Enviroment Cases', () => {
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

  describe('Valid Enviroment Cases', () => {
    it('Should setup the environment to prod successfuly', () => {
      const env = 'prod';
      const expectedMessage = `Environment successfuly set to ${env}`;
      const result = defineEnvironment(env);
      assert.strictEqual(result.message, expectedMessage);
    });

    it('Should setup the environment to devl successfuly', () => {
      const env = 'devl';
      const expectedMessage = `Environment successfuly set to ${env}`;
      const result = defineEnvironment(env);
      assert.strictEqual(result.message, expectedMessage);
    });
  });
});
