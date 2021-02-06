const ICrud = require('./interfaces/ICrud');
const Mongoose = require('mongoose');
const { v4 } = require('uuid');

const CONNECTION_STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

class MongoDb extends ICrud {
  constructor() {
    super();
    this._heroes = null;
    this._driver = null;
    this.isModelDefined = false;
  }

  async create(item) {
    return await this._heroes.create(item);
  }

  async read(item, skip = 0, limit = 10) {
    return await this._heroes.find(item).skip(skip).limit(limit);
  }

  async update(id, item) {
    return await this._heroes.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    return id
      ? await this._heroes.deleteOne({ _id: id })
      : await this._heroes.deleteMany({});
  }

  async isConnected() {
    const state = CONNECTION_STATUS[this._driver.readyState];

    if (state !== 'connecting') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return CONNECTION_STATUS[this._driver.readyState];
  }

  async connect() {
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

    this._driver = connection;
    console.log(this.isModelDefined);
    await this.defineModel();
  }

  async defineModel() {
    const heroesSchema = new Mongoose.Schema({
      _id: { type: String, required: true, default: v4 },
      name: { type: String, required: true },
      power: { type: String, required: true },
      createdAt: { type: Date, default: new Date() },
    });

    this._heroes = Mongoose.model('heroes', heroesSchema);
  }
}

module.exports = MongoDb;
