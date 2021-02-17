const MongoDb = require('./mongodb');
const Mongoose = require('mongoose');

jest.mock('mongoose');

const mongooseMock = () => {
  const connectionMockedFn = {
    once: jest.fn(() => console.log('ONCE')),
    close: jest.fn(),
  };

  const modelsMockedFn = {
    create: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mongooseMockedFn = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    Schema: class schema {},
    connection: jest.fn().mockReturnValue(connectionMockedFn),
    models: jest.fn().mockReturnValue(modelsMockedFn),
    model: jest.fn().mockReturnValue(modelsMockedFn),
  };

  Mongoose.connection = jest.fn(() => connectionMockedFn);
  // Mongoose.connect = jest.fn(() => true);
  // Mongoose.Model.mockImplementation(() => modelsMockedFn);
  // Mongoose.models = jest.fn(() => true);
  // Mongoose.model = jest.fn(() => true);
  // Mongoose.Schema.mockImplementation(() => modelsMockedFn);

  return { Mongoose, mongooseMockedFn, modelsMockedFn, connectionMockedFn };
};

const makeSut = () => {
  const {
    mongooseMockedFn,
    modelsMockedFn,
    connectionMockedFn,
  } = mongooseMock();

  const Sut = MongoDb;
  const connection = MongoDb.connect();
  const schema = 'Model { heroes }';

  return {
    Sut,
    connection,
    schema,
    mongooseMockedFn,
    modelsMockedFn,
    connectionMockedFn,
  };
};

describe('MongoDB', () => {
  describe('MongoDB exports and instaces', () => {
    it('Should be instance of Object', () => {
      const { Sut, connection, schema } = makeSut();
      const mongodb = new Sut(connection, schema);

      expect(mongodb).toBeInstanceOf(Object);
    });

    it('Should export the functions', () => {
      const { Sut, connection, schema } = makeSut();
      const mongodb = new Sut(connection, schema);

      expect(mongodb.create).toBeInstanceOf(Function);
      expect(mongodb.read).toBeInstanceOf(Function);
      expect(mongodb.update).toBeInstanceOf(Function);
      expect(mongodb.delete).toBeInstanceOf(Function);
      expect(mongodb.isConnected).toBeInstanceOf(Function);
      expect(Sut.connect).toBeInstanceOf(Function);
      expect(Sut.disconnect).toBeInstanceOf(Function);
    });
  });
  describe('MongoDB Constructor', () => {});
  describe('MongoDB Methods', () => {});
  describe('MongoDB Static Methods', () => {});
});
