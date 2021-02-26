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
      handler: (request, hapi) => {
        const { query } = request;

        const schema = Joi.object({
          skip: Joi.number().default(0),
          limit: Joi.number().default(10),
          name: Joi.string().min(3).max(100),
        });

        const validation = schema.validate(query);

        if (validation.error) {
          const error = {
            statusCode: 400,
            statusMessage: 'Bad Request',
            error: { message: validation.error.details[0].message },
          };
          return hapi.response(error).code(error.statusCode);
        }

        try {
          const { name, skip, limit } = validation.value;
          const search = name ? { name: name } : {};
          return this.db.read(search, skip, limit);
        } catch (error) {
          throw new Error(error);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
