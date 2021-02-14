const ICrud = require('../interfaces/ICrud');
const Sequelize = require('sequelize');
const isUUID = require('../../../utils/validateUUID');

class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    if (!connection || !schema)
      throw new Error('You must inject the dependecies');

    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    if (!item) {
      throw new Error('You must send the body to create the item');
    }

    try {
      const { dataValues } = await this._schema.create(item);
      return dataValues;
    } catch (error) {
      // console.log('Ops!', error);
      const errorMessage = 'Error creating data on postgres';
      throw Error(errorMessage);
    }
  }

  async read(item, skip = 0, limit = 10) {
    try {
      return await this._schema.findAll({
        where: item,
        offset: skip,
        limit: limit,
        raw: true,
      });
    } catch (error) {
      const errorMessage = 'Error on reading data from postgres';
      throw Error(errorMessage);
    }
  }

  async update(id, item) {
    if (!id || !item) {
      throw new Error('You must inform the id and the item');
    }

    if (!isUUID(id)) {
      throw new Error('This id is not an UUID');
    }

    try {
      return await this._schema.update(item, { where: { id: id } });
    } catch (error) {
      console.error('Error', error);
      throw Error(error);
    }
  }

  async delete(id) {
    if (!id) {
      throw new Error('You must inform the id');
    }

    if (!isUUID(id)) {
      throw new Error('This id is not an UUID');
    }

    try {
      const query = id ? { id } : {};
      return await this._schema.destroy({ where: query });
    } catch (error) {
      console.error('Error', error);
      throw Error(error);
    }
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
