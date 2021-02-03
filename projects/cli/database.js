const { readFile, writeFile } = require('fs');
const { promisify } = require('util');
const { v4 } = require('uuid');

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

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

  async writeDataOnFile(data) {
    await writeFileAsync(this.FILE_NAME, JSON.stringify(data));
    return true;
  }

  async get(id) {
    const response = await this.getDataFromFile();
    const filteredData = response.filter((data) =>
      id ? data.id === id : true,
    );
    return filteredData;
  }

  async register(hero) {
    const data = await this.getDataFromFile();
    const id = v4();
    const returnObject = { id, ...hero };
    const dataToWrite = [...data, returnObject];
    const result = await this.writeDataOnFile(dataToWrite);
    return result;
  }
}

module.exports = new Database();
