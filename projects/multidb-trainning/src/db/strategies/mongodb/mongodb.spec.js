const MongoDb = require('./mongodb');
const Mongoose = require('mongoose');

jest.mock('mongoose');

const mongooseMock = () => {
  const modelsMockedFn = {
    create: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  const STATES = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  Mongoose.connection = jest.fn().mockReturnValue({ STATES, modelsMockedFn });
  Mongoose.disconnect = jest.fn().mockReturnValue(true);

  return { Mongoose, STATES, modelsMockedFn };
};

const makeSut = () => {
  const { modelsMockedFn } = mongooseMock();

  const Sut = MongoDb;
  const connection = MongoDb.connect();
  const schema = modelsMockedFn;

  return {
    Sut,
    connection,
    schema,
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

    it('Should return an object containning the connection and the schema', () => {
      const { Sut, connection, schema } = makeSut();

      const mongodb = new Sut(connection, schema);
      const keys = Object.keys(mongodb);

      expect(mongodb).toBeInstanceOf(Object);
      expect(keys).toStrictEqual(['_connection', '_schema']);
    });
  });

  describe('MongoDB Methods', () => {});

  describe('MongoDB Static Methods', () => {
    describe('disconnect', () => {
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

    describe.only('connect', () => {
      it('Should throw an error if fails connect method fails', () => {
        const { Sut, errorMessage } = makeSut();

        Mongoose.connect = jest.fn(() => {
          throw new Error(errorMessage);
        });

        const act = () => {
          Sut.connect();
        };

        expect(act).toThrow('Error on connect with MongoDB');
        expect(Mongoose.connect).toHaveBeenCalled();
      });

      it.only('Should return the connection object', () => {
        const { Sut, STATES, modelsMockedFn } = makeSut();
        const result = Sut.connect();
        console.log('RESULT', result);

        expect(result).toBe({ STATES, modelsMockedFn });
      });
    });
  });
});
