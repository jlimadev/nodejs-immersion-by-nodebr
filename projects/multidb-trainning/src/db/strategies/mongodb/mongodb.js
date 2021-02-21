const ICrud = require('../interfaces/ICrud');
const Mongoose = require('mongoose');
const isUUID = require('../../../utils/validateUUID');

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();

    if (!connection || !schema)
      throw new Error('You must inject the dependecies');

    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    if (!item) {
      throw new Error('You must inform the item to be inserted');
    }

    try {
      return await this._schema.create(item);
    } catch (error) {
      const errorMessage = 'Error creating data on mongoDB';
      throw Error(errorMessage);
    }
  }

  async read(item, skip = 0, limit = 10) {
    try {
      return await this._schema.find(item).skip(skip).limit(limit);
    } catch (error) {
      const errorMessage = 'Error getting data from mongoDB';
      throw Error(errorMessage);
    }
  }

  async update(id, item) {
    if (!id || !isUUID(id))
      throw new Error('You must inform the UUID to be updated');

    if (!item) throw new Error('You must inform the item to be updated');

    try {
      return await this._schema.updateOne({ _id: id }, { $set: item });
    } catch (error) {
      const errorMessage = 'Error updating data on mongoDB';
      throw Error(errorMessage);
    }
  }

  async delete(id) {
    try {
      return id
        ? await this._schema.deleteOne({ _id: id })
        : await this._schema.deleteMany({});
    } catch (error) {
      const errorMessage = 'Error deleting data on mongoDB';
      throw Error(errorMessage);
    }
  }
  // async isConnected() {}

  static connect() {
    try {
      const uri = 'mongodb://jlimadev:secretpass@localhost:27017/heroes';
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      };

      Mongoose.connect(uri, options);

      const connection = Mongoose.connection;

      return connection;
    } catch (error) {
      const errorMessage = 'Error on connect with MongoDB';
      throw Error(errorMessage);
    }
  }

  static async disconnect() {
    try {
      await Mongoose.disconnect();
      console.log('Disconnected from database');
      return true;
    } catch (error) {
      const errorMessage = 'Error on close connection with MongoDB';
      throw Error(errorMessage);
    }
  }
}

module.exports = MongoDB;
