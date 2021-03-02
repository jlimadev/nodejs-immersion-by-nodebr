const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const schema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroRoutes = require('./routes/HeroRoutes');
const AuthRoutes = require('./routes/AuthRoutes');

const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');

const JWT_SECRET = 'SUPERBIGSECRET';

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

    const swaggerOptions = {
      info: {
        title: 'Heroes API',
        version: 'v1.0',
      },
    };

    await app.register([
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);

    app.route([
      ...mapRoutes(new HeroRoutes(context), HeroRoutes.methods()),
      ...mapRoutes(new AuthRoutes(JWT_SECRET), AuthRoutes.methods()),
    ]);

    await app.start();
    console.log(`server running on ${app.info.port}`);

    return app;
  } catch (error) {
    throw error;
  } finally {
    // MongoDB.disconnect();
    // app.stop();
  }
};

module.exports = main();
// main();
