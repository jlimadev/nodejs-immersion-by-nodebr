const { v4 } = require('uuid');
class Hero {
  constructor({ id, name, power }) {
    this.id = id || v4();
    this.name = name;
    this.power = power;
  }
}
module.exports = Hero;
