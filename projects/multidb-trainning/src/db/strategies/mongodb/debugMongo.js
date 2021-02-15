const MongoDB = require('./mongodb');
const heroesSchema = require('./schemas/heroesSchema');
const ContextStrategy = require('../context/ContextStrategy');

const call = async () => {
  MongoDB.connect();
  MongoDB.disconnect();
};

call();
