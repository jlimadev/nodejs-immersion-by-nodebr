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
        const DEFAULT_SKIP = 0;
        const DEFAULT_LIMIT = 10;

        const schema = Joi.object({
          skip: Joi.number().default(DEFAULT_SKIP),
          limit: Joi.number().default(DEFAULT_LIMIT),
          name: Joi.string().min(3).max(100),
        });

        try {
          const { query } = request;
          const validation = schema.validate(query);

          if (validation.error) {
            throw new Error(
              '[VALIDATION ERROR]',
              validation.error.details.message,
            );
          }

          const { name, skip, limit } = validation.value;
          const search = name ? { name: name } : {};
          return this.db.read(search, skip, limit);
        } catch (error) {
          throw Error(error);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
