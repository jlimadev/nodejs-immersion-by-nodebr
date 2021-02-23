const NotImplementedException = require('../../../utils/errors/NotImplementedException');

class ICrud {
  create(item) {
    throw new NotImplementedException();
  }

  read(item, skip, limit) {
    throw new NotImplementedException();
  }

  update(id, item) {
    throw new NotImplementedException();
  }

  delete(id) {
    throw new NotImplementedException();
  }

  isConnected() {
    throw new NotImplementedException();
  }

  static connect() {
    throw new NotImplementedException();
  }

  static disconnect() {
    throw new NotImplementedException();
  }
}

module.exports = ICrud;
