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
      handler: (req, res) => {
        const { query } = req;

        const schema = Joi.object({
          skip: Joi.number().default(0),
          limit: Joi.number().default(10),
          name: Joi.string().min(3).max(100),
        });

        const validation = schema.validate(query);

        if (validation.error) {
          const statusCode = 400;
          const error = {
            statusCode: 400,
            statusMessage: 'Bad Request',
            error: { message: validation.error.details[0].message },
          };
          return res.response(error).code(statusCode);
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

  create() {
    return {
      path: '/heroes',
      method: 'POST',
      handler: async (req, res) => {
        const { payload } = req;

        const schema = Joi.object({
          name: Joi.string().required().min(3).max(100),
          power: Joi.string().required().min(3).max(100),
        });

        const validation = schema.validate(payload);

        if (validation.error) {
          const statusCode = 400;
          const error = {
            statusCode,
            statusMessage: 'Bad Request',
            error: { message: validation.error.details[0].message },
          };
          return res.response(error).code(statusCode);
        }

        try {
          const { name, power } = payload;
          return await this.db.create({ name, power });
        } catch (error) {
          throw new Error(error);
        }
      },
    };
  }
}

module.exports = HeroRoutes;
