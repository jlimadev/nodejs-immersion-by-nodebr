const BaseRoute = require('./base/BaseRoute');
const Joi = require('joi');

const failAction = (req, res, error) => {
  throw error;
};

const listHandler = (db) => (req, res) => {
  const { query } = req;
  try {
    const { name, skip, limit } = query;
    const search = name ? { name: { $regex: `.*${name}*.` } } : {};
    return db.read(search, skip, limit);
  } catch (error) {
    throw new Error(error);
  }
};

const createHandler = (db) => async (req, res) => {
  const { payload } = req;
  try {
    const { name, power } = payload;
    return await db.create({ name, power });
  } catch (error) {
    throw new Error(error);
  }
};

const query = Joi.object({
  skip: Joi.number().default(0),
  limit: Joi.number().default(10),
  name: Joi.string().min(3).max(100),
});

const headers = Joi.object({
  authorization: Joi.string().required(),
}).unknown();

class HeroRoutes extends BaseRoute {
  constructor(db) {
    super();
    this.db = db;
  }

  list() {
    return {
      path: '/heroes',
      method: 'GET',
      options: {
        tags: ['api'],
        description: 'list all heroes',
        notes: 'returns heroes from database',
        validate: {
          query,
          headers,
          failAction,
        },
        handler: listHandler(this.db),
      },
    };
  }

  create() {
    return {
      path: '/heroes',
      method: 'POST',
      options: {
        tags: ['api'],
        description: 'create a hero',
        notes: 'creates a hero on database',
        validate: {
          payload: Joi.object({
            name: Joi.string().required().min(3).max(100),
            power: Joi.string().required().min(3).max(100),
          }),
          headers,
          failAction,
        },
        handler: createHandler(this.db),
      },
    };
  }

  update() {
    return {
      method: 'PATCH',
      path: '/heroes/{id?}',
      options: {
        tags: ['api'],
        description: 'update a hero by id',
        notes: 'update a hero on database based on an ID',
        validate: {
          params: Joi.object({
            id: Joi.string().required().min(3),
          }),
          payload: Joi.object({
            name: Joi.string().min(3).max(100),
            power: Joi.string().min(3).max(100),
          }),
          headers,
          failAction,
        },
        handler: async (req, res) => {
          const { payload, params } = req;

          try {
            const { id } = params;
            const strPayload = JSON.stringify(payload);
            const patchData = JSON.parse(strPayload);

            return await this.db.update(id, patchData);
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    };
  }

  delete() {
    return {
      method: 'DELETE',
      path: '/heroes/{id?}',
      options: {
        tags: ['api'],
        description: 'delete one hero by ID or all heroes (when no ID)',
        notes: 'delete one hero by ID or all heroes (when no ID) on database',
        validate: {
          params: Joi.object({
            id: Joi.string().guid(),
          }),
          headers,
          failAction,
        },
        handler: async (req, res) => {
          const { params } = req;
          try {
            const { id } = params;
            return await this.db.delete(id);
          } catch (error) {
            throw new Error(error);
          }
        },
      },
    };
  }
}

module.exports = HeroRoutes;
