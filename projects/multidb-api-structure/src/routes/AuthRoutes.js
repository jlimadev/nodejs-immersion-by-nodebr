const BaseRoute = require('./base/BaseRoute');
const Joi = require('joi');
const JWT = require('jsonwebtoken');

const failAction = (req, res, error) => {
  throw error;
};

const USER = {
  username: 'anyusername',
  password: 'anypassword',
};

class AuthRoutes extends BaseRoute {
  constructor(secret) {
    super();
    this.secret = secret;
  }

  login() {
    return {
      method: 'POST',
      path: '/login',
      options: {
        auth: false,
        tags: ['api'],
        description: 'Get JWT Token',
        notes: 'Endpoint to login into application',
        validate: {
          payload: Joi.object({
            username: Joi.string().required().min(5).max(50),
            password: Joi.string().required().min(5).max(20),
          }),
          failAction,
        },
        handler: (req, res) => {
          const { username, password } = req.payload;

          if (
            username.toLowerCase() !== USER.username ||
            password !== USER.password
          ) {
            const error = {
              statusCode: 401,
              error: 'Unauthorized',
              message: 'Invalid username or password',
            };
            return res.response(error).code(error.statusCode);
          }

          const token = JWT.sign(
            {
              username,
              id: 1,
            },
            this.secret,
          );

          return { token };
        },
      },
    };
  }
}

module.exports = AuthRoutes;
