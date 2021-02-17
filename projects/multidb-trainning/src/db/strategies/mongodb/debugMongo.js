const MongoDB = require('./mongodb');
const heroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');

const call = async () => {
  const connection = MongoDB.connect();
  const mongodb = new ContextStrategy(new MongoDB(connection, heroesSchema));
  MongoDB.disconnect();
};

call();
