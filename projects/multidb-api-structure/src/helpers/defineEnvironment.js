const { config } = require('dotenv');
const { join } = require('path');

const defineEnvironment = (env) => {
  const checkEnvironment = /^devl$|^prod$/;
  if (!checkEnvironment.test(env)) {
    throw new Error(
      `[INVALID ENV] - ${env} is invalid. The environment must be "devl" or "prod".`,
    );
  }
  const configPath = join(__dirname, '../../config', `.env.${env}`);
  config({
    path: configPath,
  });

  const message = `Environment successfuly set to ${env}`;

  return {
    message,
  };
};

module.exports = defineEnvironment;
