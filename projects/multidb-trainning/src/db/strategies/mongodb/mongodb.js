const ICrud = require('../interfaces/ICrud');
const Mongoose = require('mongoose');

class MongoDB extends ICrud {
  constructor(connection, schema) {
    super();

    if (!connection || !schema)
      throw new Error('You must inject the dependecies');

    this._connection = connection;
    this._schema = schema;
  }

  // async create(){};
  // async read(){};
  // async update(){};
  // async delete(){};
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
