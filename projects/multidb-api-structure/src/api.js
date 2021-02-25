const Hapi = require('hapi');
const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const schema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroRoutes = require('./routes/HeroRoutes');

const app = new Hapi.Server({
  port: 5000,
});

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

const main = async () => {
  try {
    const connection = MongoDB.connect();
    const context = new Context(new MongoDB(connection, schema));

    app.route([...mapRoutes(new HeroRoutes(context), HeroRoutes.methods())]);

    await app.start();
    console.log(`server running on ${app.info.port}`);

    return app;
  } catch (error) {
    console.error(error);
  } finally {
    // MongoDB.disconnect();
    // app.stop();
  }
};

module.exports = main();
// main();
