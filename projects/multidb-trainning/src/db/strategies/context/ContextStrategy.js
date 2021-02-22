const ICrud = require('../interfaces/ICrud');
class ContextStrategy extends ICrud {
  constructor(database) {
    super();
    this._database = database;
  }

  create(item) {
    return this._database.create(item);
  }

  read(item, skip, limit) {
    return this._database.read(item, skip, limit);
  }

  update(id, item) {
    return this._database.update(id, item);
  }

  delete(id) {
    return this._database.delete(id);
  }

  connect() {
    return this._database.connect();
  }

  disconnect() {
    return this._database.disconnect();
  }
}

module.exports = ContextStrategy;
