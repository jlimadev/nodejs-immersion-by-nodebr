const { hash, compare } = require('bcrypt');
const { promisify } = require('util');
const hashAsync = promisify(hash);
const compareAsync = promisify(compare);

const SALT = 5;
class PasswordHelper {
  static hashPassword(password) {
    return hashAsync(password, SALT);
  }

  static comparePassword(password, hashedPassword) {
    return compareAsync(password, hashedPassword);
  }
}

module.exports = PasswordHelper;
