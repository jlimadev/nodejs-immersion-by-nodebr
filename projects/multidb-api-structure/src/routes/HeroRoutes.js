const BaseRoute = require('./base/BaseRoute');
const Joi = require('joi');

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
        const schema = Joi.object({
          query: Joi.object().keys({
            skip: Joi.number().default(0),
            limit: Joi.number().default(1),
            name: Joi.string().min(3).max(100),
          }),
        });

        try {
          const { query } = request;
          schema.validate(query);

          const { name, skip, limit } = query;

          const search = name ? { name: name } : {};

          console.log({ limit, skip });

          return this.db.read(
            search,
            parseInt(query.skip),
            parseInt(query.limit),
          );
        } catch (error) {
          console.error('Deu ruim', error);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
