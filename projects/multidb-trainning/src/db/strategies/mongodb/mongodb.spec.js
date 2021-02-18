const MongoDb = require('./mongodb');
const Mongoose = require('mongoose');
// const HeroesSchema = require('./schemas/heroesSchema');

jest.mock('mongoose');

const mongooseMock = () => {
  const STATES = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
    99: 'uninitialized',
  };

  const mockedModelsFn = {
    create: jest.fn(),
    find: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    deleteMany: jest.fn(),
  };

  const mockedConnection = {
    model: jest.fn().mockReturnValue(mockedModelsFn),
    Schema: jest.fn(),
    states: STATES,
  };

  Mongoose.connection = mockedConnection;
  Mongoose.connect = jest.fn().mockReturnValue(true);
  Mongoose.disconnect = jest.fn().mockReturnValue(true);

  return { mockedModelsFn, mockedConnection };
};

const makeSut = () => {
  const { mockedModelsFn, mockedConnection } = mongooseMock();
  const Sut = MongoDb;
  const connection = MongoDb.connect();
  const schema = mockedModelsFn;
  // const schema = HeroesSchema;

  const errorMessage = 'Any error';
  const mockUUID = '19cb7c30-da60-45e4-b6ea-0a1f889da84c';
  const mockInput = {
    name: 'any name',
    power: 'any power',
    createdAt: '2021-02-18T21:18:25.429Z',
    __v: 0,
  };
  const mockReturnValue = { _id: mockUUID, ...mockInput };

  return {
    Sut,
    connection,
    schema,
    mockedModelsFn,
    mockedConnection,
    errorMessage,
    mockUUID,
    mockInput,
    mockReturnValue,
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

  describe('MongoDB Methods', () => {
    describe('create', () => {
      it('Should throw an error if call the method without the item', async () => {
        const { Sut, connection, schema, mockedModelsFn } = makeSut();
        const mongo = new Sut(connection, schema);

        const act = async () => {
          await mongo.create();
        };

        expect(mockedModelsFn.create).not.toHaveBeenCalled();
        await expect(act).rejects.toThrow(
          'You must inform the item to be inserted',
        );
      });

      it('Should throw an error if mongo create rejects', async () => {
        const {
          Sut,
          connection,
          schema,
          mockedModelsFn,
          errorMessage,
          mockInput,
        } = makeSut();
        const mongo = new Sut(connection, schema);

        mockedModelsFn.create = jest.fn(() =>
          Promise.reject(new Error(errorMessage)),
        );

        const act = async () => {
          await mongo.create(mockInput);
        };

        await expect(act).rejects.toThrow('Error creating data on mongoDB');
        expect(mockedModelsFn.create).toHaveBeenCalled();
      });

      it('Should create the item on mongoDB', async () => {
        const {
          Sut,
          connection,
          schema,
          mockedModelsFn,
          mockInput,
          mockReturnValue,
        } = makeSut();
        const mongo = new Sut(connection, schema);

        mockedModelsFn.create = jest.fn().mockReturnValue(mockReturnValue);

        const result = await mongo.create(mockInput);

        await expect(result).toStrictEqual(mockReturnValue);
        expect(mockedModelsFn.create).toHaveBeenCalled();
      });
    });
  });

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

    describe('connect', () => {
      it('Should throw an error if connect method fails', () => {
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

      it('Should return the connection object', () => {
        const { Sut, mockedConnection } = makeSut();
        const result = Sut.connect();

        expect(result).toStrictEqual(mockedConnection);
      });
    });
  });
});
