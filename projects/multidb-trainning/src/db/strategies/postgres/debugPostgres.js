const Postgres = require('./postgres');
const HeroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');

const call = async () => {
  const sampleObject = { name: 'Ruru', power: 'Gordin' };

  const connection = Postgres.connect();

  const model = await Postgres.defineModel(connection, HeroesSchema);

  const context = new ContextStrategy(new Postgres(connection, model));

  // const createdObject = await context.create(sampleObject);

  /* 
  const updatedObject = await context.update(
    '19cb7c30-da60-45e4-b6ea-0a1f889da84c',
    sampleObject,
  ); 
  */

  /* 
  const deletedObject = await context.delete(
    '19cb7c30-da60-45e4-b6ea-0a1f889da84c',
  );
 */

  // const deleteAll = await context.delete();
  const returnValues = await context.read();

  const d = await context.isConnected();
  console.log(d);
};

call();
