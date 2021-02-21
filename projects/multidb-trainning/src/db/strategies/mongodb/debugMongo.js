const MongoDB = require('./mongodb');
const heroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');

const call = async () => {
  const connection = MongoDB.connect();
  const mongodb = new ContextStrategy(new MongoDB(connection, heroesSchema));
  // const result = await mongodb.create({ name: 'Jon', power: 'Nainha' });
  // const result = await mongodb.read();
  // const result = await mongodb.update('19cb7c30-da60-45e4-b6ea-0a1f889da84c', {
  //   name: 'Jon',
  //   power: 'Tureco',
  // });

  const result = await mongodb.delete('fgsgfs');

  console.log(result);
  MongoDB.disconnect();
};

call();
