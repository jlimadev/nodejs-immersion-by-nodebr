const BaseRoute = require('./base/BaseRoute');

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      handler: (request, response) => {
        return this.db.read();
      },
    };
  }
}

module.exports = HeroRoutes;
