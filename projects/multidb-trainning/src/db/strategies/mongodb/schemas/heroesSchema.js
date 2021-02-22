const Mongoose = require('mongoose');
const { v4 } = require('uuid');

const modelName = 'heroes';

const heroesSchema = new Mongoose.Schema({
  _id: { type: String, required: true, default: v4 },
  name: { type: String, required: true },
  power: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
});

const returnValue = Mongoose.models[modelName]
  ? Mongoose.model(modelName)
  : Mongoose.model(modelName, heroesSchema);

console.log('Mongoose.model', Mongoose.model);

module.exports = returnValue;
