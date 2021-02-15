const MongoDb = require('./mongodb');
const heroesSchema = require('./schemas/heroesSchema');
const Mongoose = require('mongoose');

jest.mock('mongoose');

const mongooseMock = () => {};

const makeSut = () => {
  const Sut = MongoDb;

  return { Sut };
};

describe('MongoDB', () => {
  describe('MongoDB exports and instaces', () => {});
  describe('MongoDB Constructor', () => {});
  describe('MongoDB Methods', () => {});
  describe('MongoDB Static Methods', () => {});
});
