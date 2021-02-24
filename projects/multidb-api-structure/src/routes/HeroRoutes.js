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
        try {
          const {
            query: { skip, limit, name },
          } = request;

          const query = name ? { name: name } : {};
          if (skip && isNaN(skip)) throw new Error('Limit must be a number');
          if (limit && isNaN(limit)) throw new Error('Limit must be a number');

          return this.db.read(query, parseInt(skip), parseInt(limit));
        } catch (error) {
          console.error('Deu ruim', error);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
