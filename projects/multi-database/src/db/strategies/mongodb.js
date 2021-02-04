const ICrud = require('./interfaces/ICrud');

class MongoDb extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.info('The item was created successfully on MongoDb');
  }
}

module.exports = MongoDb;
