const ICrud = require('./interfaces/ICrud');
const Sequelize = require('sequelize');
class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heroes = null;
  }

  async create(item) {
    const { dataValues } = await this._heroes.create(item);
    return dataValues;
  }

  async read(item) {
    return await this._heroes.findAll({ where: item, raw: true });
  }

  async update(id, item) {
    return await this._heroes.update(item, { where: { id: id } });
  }

  async delete(id) {
    const query = id ? { id } : {};
    return await this._heroes.destroy({ where: query });
  }

  async isConnected() {
    try {
      await this._driver.authenticate();
      return true;
    } catch (error) {
      console.error('Failed', error);
      return false;
    }
  }

  async connect() {
    this._driver = new Sequelize('heroes', 'root', 'root', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: 0,
    });
    await this.defineModel();
  }

  async defineModel() {
    this._heroes = this._driver.define(
      'heroes',
      {
        id: {
          type: Sequelize.UUIDV4,
          defaultValue: Sequelize.UUIDV4,
          required: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          required: true,
        },
        power: {
          type: Sequelize.STRING,
          required: true,
        },
      },
      {
        tableName: 'TB_HEROES',
        freezeTableName: false,
        timestamps: false,
      },
    );
    await this._heroes.sync();
  }
}

module.exports = Postgres;
