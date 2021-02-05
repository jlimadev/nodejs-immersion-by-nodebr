const ICrud = require('./interfaces/ICrud');
const Sequelize = require('sequelize');
class Postgres extends ICrud {
  constructor() {
    super();
    this._driver = null;
    this._heroes = null;
    this._connect();
  }

  _connect() {
    this._driver = new Sequelize('heroes', 'root', 'root', {
      host: 'localhost',
      dialect: 'postgres',
      quoteIdentifiers: false,
      operatorsAliases: 0,
    });
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
    await _heroes.sync();
  }

  create(item) {
    console.info('The item was created successfully on Postgres');
  }
}

module.exports = Postgres;
