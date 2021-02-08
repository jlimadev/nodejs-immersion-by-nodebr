const Sequelize = require('sequelize');

const HeroesSchema = {
  name: 'heroes',
  schema: {
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
  options: {
    tableName: 'TB_HEROES',
    freezeTableName: false,
    timestamps: false,
  },
};

module.exports = HeroesSchema;
