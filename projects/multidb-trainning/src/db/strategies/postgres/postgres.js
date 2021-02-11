const ICrud = require('../interfaces/ICrud');
const Sequelize = require('sequelize');

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    if (!connection || !schema)
      throw new Error('You must inject the dependecies');

    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item, skip = 0, limit = 10) {
    return await this._schema.findAll({
      where: item,
      offset: skip,
      limit: limit,
      raw: true,
    });
  }

  async update(id, item) {
    return await this._schema.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return await this._schema.destroy({ where: query });
  }

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
