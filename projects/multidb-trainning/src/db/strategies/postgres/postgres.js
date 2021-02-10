const ICrud = require('../interfaces/ICrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {}

  async read(item, skip = 0, limit = 10) {}

  update(id, item) {}
  delete(id) {}

  async isConnected() {
    try {
      await this._connection.authenticate();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  static connect() {
    const connection = new Sequelize('heroes', 'root', 'root', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: 0,
      logging: false,
    });

    console.log('Connected');
    return connection;
  }

  static disconnect(connection) {
    console.log('Disconnected');
    connection.close();
  }

  static async defineModel(connection, schema) {
    const heroesModel = connection.define(
      schema.name,
      schema.schema,
      schema.options,
    );
    await heroesModel.sync();
    return heroesModel;
  }
}

module.exports = Postgres;
