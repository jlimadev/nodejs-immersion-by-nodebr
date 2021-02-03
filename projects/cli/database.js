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

  async add(body) {
    if (!body) {
      throw new Error('You must send the body of this request');
    }

    const data = await this.getDataFromFile();
    const id = v4();

    const returnObject = { id, ...body };
    const dataToWrite = data ? [...data, returnObject] : [returnObject];

    return await this.writeDataOnFile(dataToWrite);
  }

  async update(id, body) {
    if (!id) {
      throw new Error('You must inform an id');
    }

    if (!body) {
      throw new Error('You must send the body of this request');
    }

    const data = await this.getDataFromFile(id);
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('This hero does not exists');
    }

    const updatedBody = {
      id,
      ...body,
    };

    data.splice(index, 1, updatedBody);
    return await this.writeDataOnFile(data);
  }

  async delete(id) {
    if (!id) {
      return await this.writeDataOnFile([]);
    }

    const data = await this.getDataFromFile(id);
    const index = data.findIndex((item) => item.id === id);

    if (index === -1) {
      throw new Error('This hero does not exists');
    }

    data.splice(index, 1);

    return await this.writeDataOnFile(data);
  }
}

module.exports = new Database();
