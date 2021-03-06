const ICrud = require('../interfaces/ICrud');
const Sequelize = require('sequelize');
class Postgres extends ICrud {
  constructor(connection, schema) {
    super();
    this._connection = connection;
    this._schema = schema;
  }

  async create(item) {
    const { dataValues } = await this._schema.create(item);
    return dataValues;
  }

  async read(item) {
    return await this._schema.findAll({ where: item, raw: true });
  }

  async update(id, item, upsert = false) {
    return upsert
      ? await this._schema.upsert(item)
      : await this._schema.update(item, { where: { id } });
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
      console.error('Failed', error);
      return false;
    }
  }

  static async connect() {
    const postgresURL = process.env.POSTGRES_URL;
    const connection = new Sequelize(postgresURL, {
      quoteIdentifiers: false,
      operatorsAliases: 0,
      logging: false,
      ssl: process.env.ENVIRONMENT === 'prod',
      dialectOptions: {
        ssl: process.env.ENVIRONMENT === 'prod',
      },
    });
    return connection;
  }

  static async disconnect(connection) {
    await connection.close();
  }

  static async defineModel(connection, schema) {
    const model = connection.define(schema.name, schema.schema, schema.options);
    await model.sync();
    return model;
  }
}

module.exports = Postgres;
