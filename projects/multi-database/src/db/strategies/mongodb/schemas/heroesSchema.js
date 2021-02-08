const Mongoose = require('mongoose');
const { v4 } = require('uuid');

const heroesSchema = new Mongoose.Schema({
  _id: { type: String, required: true, default: v4 },
  name: { type: String, required: true },
  power: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
});

module.exports =
  Mongoose.model.heroes || Mongoose.model('heroes', heroesSchema);
