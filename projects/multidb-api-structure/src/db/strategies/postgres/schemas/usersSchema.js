const Sequelize = require('sequelize');

const UsersSchema = {
  name: 'users',
  schema: {
    id: {
      type: Sequelize.UUIDV4,
      defaultValue: Sequelize.UUIDV4,
      required: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      unique: true,
      required: true,
    },
    password: {
      type: Sequelize.STRING,
      required: true,
    },
  },
  options: {
    tableName: 'TB_USERS',
    freezeTableName: false,
    timestamps: false,
  },
};

module.exports = UsersSchema;
