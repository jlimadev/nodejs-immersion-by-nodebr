const Sequelize = require('sequelize');
const driver = new Sequelize('heroes', 'root', 'root', {
  host: 'localhost',
  dialect: 'postgres',
  quoteIdentifiers: false,
  operatorsAliases: 0,
});

const main = async () => {
  const Heroes = driver.define(
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

  await Heroes.sync();

  const result = await Heroes.findAll({
    raw: true,
  });

  console.log('result', result);
};

main();
