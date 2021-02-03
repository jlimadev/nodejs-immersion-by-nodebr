const { readFile } = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(readFile);

// instead of using require fs to read the file we can import directly the json file
// const jsonFile = require('./heroes.json');

class Database {
  constructor() {
    this.FILE_NAME = 'heroes.json';
  }

  async getDataFromFile() {
    const file = await readFileAsync(this.FILE_NAME, 'utf8');
    return JSON.parse(file.toString());
  }

  async writeDataOnFile() {
    return null;
  }

  async get(id) {
    const response = await this.getDataFromFile();
    const filteredData = response.filter((data) =>
      id ? data.id === id : true,
    );
    return filteredData;
  }
}

module.exports = new Database();
