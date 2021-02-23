const Hapi = require('hapi');
const context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const schema = require('./db/strategies/mongodb/schemas/heroesSchema');

const app = new Hapi.Server({
  port: 5000,
});

const main = async () => {
  const connection = MongoDB.connect();
  const mongo = new context(new MongoDB(connection, schema));
  app.route([
    {
      path: '/heroes',
      method: 'GET',
      handler: (request, head) => {
        return mongo.read();
      },
    },
  ]);

  await app.start();
  console.log(`server running on ${app.info.port}`);

  return app;
};

module.exports = main();
main();
