const MongoDB = require('./mongodb');
const heroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');

const call = async () => {
  const connection = MongoDB.connect();
  const mongodb = new ContextStrategy(new MongoDB(connection, heroesSchema));
  const result = await mongodb.create({ name: 'Jon', power: 'Nainha' });
  console.log(result);
  MongoDB.disconnect();
};

call();
