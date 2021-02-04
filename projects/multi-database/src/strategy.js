class NotImplementedException extends Error {
  constructor() {
    super('Not Implemented Exception');
  }
}

class ICrud {
  create(item) {
    throw new NotImplementedException();
  }

  get(query) {
    throw new NotImplementedException();
  }

  update(id, item) {
    throw new NotImplementedException();
  }

  delete(id) {
    throw new NotImplementedException();
  }
}

class MongoDB extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.info('The item was created successfully on MongoDB');
  }
}

class Postgres extends ICrud {
  constructor() {
    super();
  }

  create(item) {
    console.info('The item was created successfully on Postgres');
  }
}

class ContextStrategy {
  constructor(strategy) {
    this._database = strategy;
  }

  create(item) {
    return this._database.create(item);
  }

  get(item) {
    return this._database.get(item);
  }

  update(id, item) {
    return this._database.update(id, item);
  }

  delete(id) {
    return this._database.delete(id);
  }
}

const contextMongo = new ContextStrategy(new MongoDB());
contextMongo.create();
const contextPostgres = new ContextStrategy(new Postgres());
contextPostgres.create();
