const ICrud = require('./interfaces/ICrud');

class Postgres extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.info('The item was created successfully on Postgres');
  }
}

module.exports = Postgres;
