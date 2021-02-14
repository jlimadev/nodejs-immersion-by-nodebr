const Postgres = require('./postgres');
const HeroesSchema = require('./schemas/heroesSchema');
const Sequelize = require('sequelize');

jest.mock('sequelize');

const sequelizeMock = () => {
  const defineModelMockedFunctions = {
    sync: jest.fn(),
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const sequelizeMockedFunctions = {
    authenticate: jest.fn(),
    close: jest.fn(),
    define: jest.fn().mockReturnValue(defineModelMockedFunctions),
  };

  Sequelize.mockImplementation(() => sequelizeMockedFunctions);

  return {
    Sequelize,
    sequelizeMockedFunctions,
    defineModelMockedFunctions,
  };
};

// Factory SUT = System Under Test
const makeSut = async () => {
  const {
    sequelizeMockedFunctions,
    defineModelMockedFunctions,
  } = sequelizeMock();
  const Sut = Postgres;

  const connection = Sut.connect();
  const schema = await Sut.defineModel(connection, HeroesSchema);

  const mockUUID = '19cb7c30-da60-45e4-b6ea-0a1f889da84c';
  const mockInput = { name: 'any name', power: 'any power' };
  const mockUpdate = { name: 'any other name', power: 'any other power' };
  const mockedReturnValue = { id: mockUUID, ...mockInput };
  const errorMessage = 'Any Error';

  return {
    Sut,
    connection,
    schema,
    sequelizeMockedFunctions,
    defineModelMockedFunctions,
    mockUUID,
    mockInput,
    mockUpdate,
    mockedReturnValue,
    errorMessage,
  };
};

describe('Postgres exports', () => {
  it('Should be instance of object', async () => {
    const { Sut, connection, schema } = await makeSut();
    const postgres = new Sut(connection, schema);

    expect(postgres).toBeInstanceOf(Object);
    expect(postgres.create).toBeInstanceOf(Function);
    expect(postgres.read).toBeInstanceOf(Function);
    expect(postgres.update).toBeInstanceOf(Function);
    expect(postgres.delete).toBeInstanceOf(Function);
    expect(postgres.isConnected).toBeInstanceOf(Function);
    expect(Sut.connect).toBeInstanceOf(Function);
    expect(Sut.disconnect).toBeInstanceOf(Function);
    expect(Sut.defineModel).toBeInstanceOf(Function);
  });
});

describe('Postgres Constructor', () => {
  it('Should throw a new error if connection is not informed', async () => {
    // Arrange
    const { Sut, schema } = await makeSut();

    // Act
    const act = () => {
      new Sut(undefined, schema);
    };

    // Assert
    expect(act).toThrow('You must inject the dependecies');
  });

  it('Should throw a new error if the schema is not informed', async () => {
    // Arrange
    const { Sut, connection } = await makeSut();

    // Act
    const act = () => {
      new Sut(connection, undefined);
    };

    // Assert
    expect(act).toThrow('You must inject the dependecies');
  });

  it('Should return an object that contains the connection infos', async () => {
    // Arrange
    const { Sut, connection, schema } = await makeSut();

    // Act
    const postgres = new Sut(connection, schema);
    const keys = Object.keys(postgres);

    // Assert
    expect(postgres).toBeInstanceOf(Object);
    expect(keys).toEqual(['_connection', '_schema']);
  });
});

describe('Postgres Methods', () => {
  describe('create', () => {
    it('Should return an error if create rejects', async () => {
      // Arrange
      const {
        Sut,
        connection,
        schema,
        errorMessage,
        defineModelMockedFunctions,
      } = await makeSut();

      const postgres = new Sut(connection, schema);

      defineModelMockedFunctions.create = jest.fn(async () =>
        Promise.reject(new Error(errorMessage)),
      );

      // Act
      const act = async () => {
        await postgres.create({ item: 'any' });
      };

      // Assert
      await expect(act()).rejects.toThrow('Error creating data on postgres');
      expect(defineModelMockedFunctions.create).toHaveBeenCalled();
    });

    it('Should return an error if dont send the item', async () => {
      // Arrange
      const {
        Sut,
        connection,
        schema,
        defineModelMockedFunctions,
      } = await makeSut();

      const postgres = new Sut(connection, schema);

      // Act
      const act = async () => {
        await postgres.create();
      };

      // Assert
      await expect(act()).rejects.toThrow(
        'You must send the body to create the item',
      );
      expect(defineModelMockedFunctions.create).not.toHaveBeenCalled();
    });

    it('Should return an object with the inserted data', async () => {
      // Arrange
      const {
        Sut,
        connection,
        schema,
        mockInput,
        mockedReturnValue,
        defineModelMockedFunctions,
      } = await makeSut();

      const postgres = new Sut(connection, schema);

      defineModelMockedFunctions.create = jest
        .fn()
        .mockReturnValue({ dataValues: mockedReturnValue });

      // Act
      const dataValues = await postgres.create(mockInput);

      // Assert
      expect(dataValues).toStrictEqual(mockedReturnValue);
      expect(defineModelMockedFunctions.create).toHaveBeenCalled();
      expect(defineModelMockedFunctions.create).toHaveBeenCalledWith(mockInput);
    });
  });

  describe('read', () => {
    it('Should return an error if read rejects', async () => {
      const {
        Sut,
        connection,
        schema,
        errorMessage,
        defineModelMockedFunctions,
      } = await makeSut();
      const postgres = new Sut(connection, schema);

      defineModelMockedFunctions.findAll = jest.fn(() =>
        Promise.reject(new Error(errorMessage)),
      );

      const act = async () => {
        await postgres.read();
      };

      await expect(act).rejects.toThrow('Error on reading data from postgres');
      expect(defineModelMockedFunctions.findAll).toHaveBeenCalled();
    });

    it('Should return an array with the result(s) of reading', async () => {
      const {
        Sut,
        connection,
        schema,
        mockUUID,
        mockedReturnValue,
        defineModelMockedFunctions,
      } = await makeSut();
      const postgres = new Sut(connection, schema);
      const searchItem = { id: mockUUID };

      defineModelMockedFunctions.findAll = jest
        .fn()
        .mockReturnValue([mockedReturnValue]);

      const result = await postgres.read(searchItem);

      expect(result).toStrictEqual([mockedReturnValue]);
      expect(Array.isArray(result)).toBe(true);

      expect(defineModelMockedFunctions.findAll).toHaveBeenCalled();
      expect(defineModelMockedFunctions.findAll).toHaveBeenCalledWith({
        where: searchItem,
        offset: 0,
        limit: 10,
        raw: true,
      });
    });

    it('Should return an empty array if nothing is found', async () => {
      const {
        Sut,
        connection,
        schema,
        mockUUID,
        defineModelMockedFunctions,
      } = await makeSut();
      const postgres = new Sut(connection, schema);
      const searchItem = { id: mockUUID };

      defineModelMockedFunctions.findAll = jest.fn().mockReturnValue([]);

      const result = await postgres.read(searchItem);

      expect(result).toStrictEqual([]);
      expect(Array.isArray(result)).toBe(true);

      expect(defineModelMockedFunctions.findAll).toHaveBeenCalled();
      expect(defineModelMockedFunctions.findAll).toHaveBeenCalledWith({
        where: searchItem,
        offset: 0,
        limit: 10,
        raw: true,
      });
    });
  });

  describe('update', () => {
    it('Should return an error if update rejects', async () => {
      const { Sut, connection, schema, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.update = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.update({});
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return an error if is not an UUID', async () => {
      const { Sut, connection, schema, mockUpdate, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.update = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.update('InvalidUUID', mockUpdate);
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return an error if id is missing', async () => {
      const { Sut, connection, schema, mockUpdate, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.update = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.update(undefined, mockUpdate);
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return an error if body is missing', async () => {
      const { Sut, connection, schema, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.update = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.update('validUUID', undefined);
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return [ 1 ] if updated successfuly', async () => {
      const {
        Sut,
        connection,
        schema,
        mockedReturnValue,
        mockUpdate,
      } = makeSut();
      const postgres = new Sut(connection, schema);
      const expectedResponse = '[ 1 ]';
      const expectedUpdatedResponse = { ...mockedReturnValue, ...mockUpdate };

      postgres.update = jest.fn().mockReturnValue('[ 1 ]');
      postgres.read = jest
        .fn()
        .mockReturnValue({ ...mockedReturnValue, ...mockUpdate });

      const result = await postgres.update(mockedReturnValue.id, mockUpdate);
      const readUpdatedValue = await postgres.read(mockedReturnValue.id);

      expect(result).toStrictEqual(expectedResponse);
      expect(readUpdatedValue).toStrictEqual(expectedUpdatedResponse);
    });

    it('Should return [ 0 ] if try to update an non existing Id', async () => {
      const { Sut, connection, schema, mockUpdate } = makeSut();
      const postgres = new Sut(connection, schema);
      const expectedResponse = '[ 0 ]';

      postgres.update = jest.fn().mockReturnValue('[ 0 ]');

      const result = await postgres.update('nonExistingId', mockUpdate);

      expect(result).toStrictEqual(expectedResponse);
    });
  });

  describe('delete', () => {
    it('Should return an error if delete fails or rejects', async () => {
      const { Sut, connection, schema, mockUUID, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.delete = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.delete(mockUUID);
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return an error if is not an UUID', async () => {
      const { Sut, connection, schema, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.delete = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.delete('InvalidUUID');
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return an error if id is missing', async () => {
      const { Sut, connection, schema, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.delete = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.delete(undefined);
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return 1 if deleted successfuly', async () => {
      const { Sut, connection, schema, mockUUID } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.delete = jest.fn().mockReturnValue(1);

      const result = await postgres.delete(mockUUID);

      expect(result).toStrictEqual(1);
    });

    it('Should return 0 if nothing is deleted', async () => {
      const { Sut, connection, schema, mockUUID } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.delete = jest.fn().mockReturnValue(0);

      const result = await postgres.delete(mockUUID);

      expect(result).toStrictEqual(0);
    });
  });
});
