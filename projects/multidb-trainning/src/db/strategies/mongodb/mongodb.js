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
  async isConnected() {}

  static connect() {
    const uri = 'mongodb://jlimadev:secretpass@localhost:27017/heroes';

    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    Mongoose.connect(uri, options);

    const connection = Mongoose.connection;

    connection.once('open', () => {
      console.log('Database is running');
      return true;
    });

    return connection;
  }

  static async disconnect() {
    Mongoose.connection.close();
    Mongoose.disconnect();
    console.log('Diconnected from database');
  }
}

module.exports = MongoDB;
