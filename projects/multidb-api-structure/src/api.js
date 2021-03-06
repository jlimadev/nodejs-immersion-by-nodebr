const Hapi = require('@hapi/hapi');
const Vision = require('@hapi/vision');
const Inert = require('@hapi/inert');
const HapiSwagger = require('hapi-swagger');
const HapiAuthJWT = require('hapi-auth-jwt2');

const Context = require('./db/strategies/base/contextStrategy');
const MongoDB = require('./db/strategies/mongodb/mongodb');
const Postgres = require('./db/strategies/postgres/postgres');
const usersSchema = require('./db/strategies/postgres/schemas/usersSchema');
const heroesSchema = require('./db/strategies/mongodb/schemas/heroesSchema');
const HeroRoutes = require('./routes/HeroRoutes');
const AuthRoutes = require('./routes/AuthRoutes');

const defineEnvironment = require('./helpers/defineEnvironment');
const env = process.env.NODE_ENV || 'devl';
defineEnvironment(env);

const JWT_SECRET = process.env.JWT_SECRET;

const app = new Hapi.Server({
  port: process.env.PORT,
});

const mapRoutes = (instance, methods) => {
  return methods.map((method) => instance[method]());
};

const main = async () => {
  try {
    const connectionMongoDb = MongoDB.connect();
    const contextMongoDb = new Context(
      new MongoDB(connectionMongoDb, heroesSchema),
    );

    const connectionPostgres = await Postgres.connect();
    const model = await Postgres.defineModel(connectionPostgres, usersSchema);
    const contextPostgres = new Context(
      new Postgres(connectionPostgres, model),
    );

    const swaggerOptions = {
      info: {
        title: 'Heroes API',
        version: 'v1.0',
      },
    };

    await app.register([
      HapiAuthJWT,
      Inert,
      Vision,
      {
        plugin: HapiSwagger,
        options: swaggerOptions,
      },
    ]);

    app.auth.strategy('jwt', 'jwt', {
      key: JWT_SECRET,
      options: {
        expiresIn: 3600,
      },
      validate: async (data, request) => {
        const result = await contextPostgres.read({
          username: data.username,
          id: data.id,
        });

        if (!result) {
          return {
            isValid: false,
          };
        }
        return {
          isValid: true,
        };
      },
    });

    app.auth.default('jwt');

    app.route([
      ...mapRoutes(new HeroRoutes(contextMongoDb), HeroRoutes.methods()),
      ...mapRoutes(
        new AuthRoutes(JWT_SECRET, contextPostgres),
        AuthRoutes.methods(),
      ),
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
