const Postgres = require('./postgres');
const HeroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');

const call = async () => {
  const sampleObject = { name: 'Ruru', power: 'Gordin' };

  const connection = Postgres.connect();

  const model = await Postgres.defineModel(connection, HeroesSchema);

  const context = new ContextStrategy(new Postgres(connection, model));

  const createdObject = await context.create(sampleObject);

  console.log(createdObject);
  Postgres.disconnect(connection);
};

call();
