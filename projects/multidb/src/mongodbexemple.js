const Mongoose = require('mongoose');
const { v4 } = require('uuid');

Mongoose.connect(
  'mongodb://jlimadev:secretpass@localhost:27017/heroes',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) return;
    console.err('Error to connect to mongodb', err);
  },
);

const connection = Mongoose.connection;
connection.once('open', () => console.log('Database is Running'));
/** 
 * Get application connection state 
 * const state = connection.readyState;
  0 = disconnected
  1 = connected
  2 = connecting
  3 = disconnecting 
*/

const heroesSchema = new Mongoose.Schema({
  _id: { type: String, required: true, default: v4 },
  name: { type: String, required: true },
  power: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
});

const model = Mongoose.model('heroes', heroesSchema);

const main = async () => {
  const resultRegister = await model.create({
    name: 'Runa',
    power: 'Joga!',
  });

  console.log('Result', resultRegister);

  const listItems = await model.find();
  console.log('List', listItems);
};

main();
