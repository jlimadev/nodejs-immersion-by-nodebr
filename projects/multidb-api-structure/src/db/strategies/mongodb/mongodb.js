const ICrud = require('../interfaces/ICrud');
const Mongoose = require('mongoose');

const CONNECTION_STATUS = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

class MongoDb extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    return await this._schema.create(item);
  }

  async read(item, skip = 0, limit = 10) {
    return await this._schema.find(item).skip(skip).limit(limit);
  }

  async update(id, item) {
    return await this._schema.updateOne({ _id: id }, { $set: item });
  }

  async delete(id) {
    return id
      ? await this._schema.deleteOne({ _id: id })
      : await this._schema.deleteMany({});
  }

  async isConnected() {
    const state = CONNECTION_STATUS[this._connection.readyState];

    if (state !== 'connecting') return state;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    return CONNECTION_STATUS[this._connection.readyState];
  }

  static connect() {
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

    return connection;
  }

  static disconnect() {
    Mongoose.connection.close();
    Mongoose.disconnect();
  }
}

module.exports = MongoDb;
