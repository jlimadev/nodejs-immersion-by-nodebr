const MongoDb = require('./mongodb');
const Mongoose = require('mongoose');
// const HeroesSchema = require('./schemas/heroesSchema');

jest.mock('mongoose');

const mongooseMock = () => {
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
    connection: jest.fn(),
  };

  Mongoose.connection = jest.fn();
  Mongoose.disconnect = jest.fn().mockReturnValue(true);
  // Mongoose.Schema.mockImplementation(() => modelsMockedFn);
  // Mongoose.Model.mockImplementation(() => modelsMockedFn);
  // Mongoose.connect = jest.fn(() => true);
  // Mongoose.Model.mockImplementation(() => modelsMockedFn);
  // Mongoose.models = jest.fn(() => true);
  // Mongoose.model = jest.fn(() => true);

  return { Mongoose, mongooseMockedFn, modelsMockedFn };
};

const makeSut = () => {
  const { mongooseMockedFn, modelsMockedFn } = mongooseMock();

  const Sut = MongoDb;
  const connection = MongoDb.connect();
  const schema = 'Model { heroes }';
  // const schema = HeroesSchema;

  return {
    Sut,
    connection,
    schema,
    mongooseMockedFn,
    modelsMockedFn,
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

  describe('MongoDB Constructor', () => {
    it('Should throw an error if connection is not informed', () => {
      const { Sut, schema } = makeSut();

      const act = () => {
        new Sut(undefined, schema);
      };

      expect(act).toThrow('You must inject the dependecies');
    });
    it('Should throw an error if schema is not informed', () => {
      const { Sut, connection } = makeSut();

      const act = () => {
        new Sut(connection, undefined);
      };

      expect(act).toThrow('You must inject the dependecies');
    });
    it('Should return an object containning', () => {
      const { Sut, connection, schema } = makeSut();

      const mongodb = new Sut(connection, schema);
      const keys = Object.keys(mongodb);

      expect(mongodb).toBeInstanceOf(Object);
      expect(keys).toStrictEqual(['_connection', '_schema']);
    });
  });

  describe('MongoDB Methods', () => {
    it('Should throw an error if fails on close connection', async () => {
      const { Sut, errorMessage } = makeSut();
      Mongoose.disconnect = jest.fn(() => {
        throw new Error(errorMessage);
      });

      const act = async () => {
        await Sut.disconnect();
      };

      expect(act()).rejects.toThrow('Error on close connection with MongoDB');
      expect(Mongoose.disconnect).toHaveBeenCalled();
    });

    it('Should close the connection', async () => {
      const { Sut } = makeSut();

      const result = await Sut.disconnect();

      expect(result).toBe(true);
      expect(Mongoose.disconnect).toHaveBeenCalled();
    });
  });
  describe('MongoDB Static Methods', () => {});
});
