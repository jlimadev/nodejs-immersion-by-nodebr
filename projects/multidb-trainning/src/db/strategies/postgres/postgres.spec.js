const Postgres = require('./postgres');
const HeroesSchema = require('./schemas/heroesSchema');

const MS = () => {
  const definedTable = {
    sync: jest.fn(() => console.log('HERE')),
    create: jest.fn(),
    read: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockedSequelize = {
    authenticate: jest.fn(),
    close: jest.fn(),
    define: jest.fn(() => definedTable),
  };

  const actualSequelize = jest.requireActual('sequelize');
  return {
    Sequelize: jest.fn(() => mockedSequelize),
    mockedSequelize,
    DataTypes: actualSequelize.DataTypes,
  };
};
const { mockedSequelize } = MS();

const Sequelize = jest.fn().mockImplementation(() => {
  return mockedSequelize;
});

// Factory SUT = System Under Test
const makeSut = () => {
  const Sut = Postgres;
  const connection = Sut.connect();
  const schema = 'heroes';
  const mockUUID = '19cb7c30-da60-45e4-b6ea-0a1f889da84c';
  const mockInput = { name: 'any name', power: 'any power' };
  const mockUpdate = { name: 'any other name', power: 'any other power' };
  const mockedReturnValue = { id: 1, ...mockInput };
  const errorMessage = 'Any Error';

  return {
    Sut,
    connection,
    schema,
    mockUUID,
    mockInput,
    mockUpdate,
    mockedReturnValue,
    errorMessage,
  };
};

describe('Sequelize', () => {
  it.only('Should setup', async () => {
    const { Sut, schema, mockedSequelize } = makeSut();
    const connection = Sut.connect();
    const model = await Sut.defineModel(connection, HeroesSchema);
    console.log(model);
  });
});

describe('Postgres exports', () => {
  it('Should be instance of object', () => {
    const { Sut, connection, schema } = makeSut();
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
    const { Sut, schema } = makeSut();

    // Act
    const act = () => {
      new Sut('', schema);
    };

    // Assert
    expect(act).toThrow('You must inject the dependecies');
  });

  it('Should throw a new error if the schema is not informed', async () => {
    // Arrange
    const { Sut, connection } = makeSut();

    // Act
    const act = () => {
      new Sut(connection, '');
    };

    // Assert
    expect(act).toThrow('You must inject the dependecies');
  });

  it('Should return an object that contains the connection infos', async () => {
    // Arrange
    const { Sut, connection, schema } = makeSut();

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
      const { Sut, connection, schema, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.create = jest.fn(async () =>
        Promise.reject(new Error(errorMessage)),
      );

      // Act
      const act = async () => {
        await postgres.create({});
      };

      // Assert
      await expect(act()).rejects.toThrow(errorMessage);
    });

    it('Should return an object with the inserted data', async () => {
      // Arrange
      const {
        Sut,
        connection,
        schema,
        mockInput,
        mockedReturnValue,
      } = makeSut();
      const postgres = new Sut(connection, schema);
      postgres.create = jest.fn().mockReturnValue(mockedReturnValue);

      // Act
      const result = await postgres.create(mockInput);

      // Assert
      expect(result).toStrictEqual(mockedReturnValue);
    });
  });

  describe('read', () => {
    it('Should return an error if read rejects', async () => {
      const { Sut, connection, schema, errorMessage } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.read = jest.fn(() => Promise.reject(new Error(errorMessage)));

      const act = async () => {
        await postgres.read({ item: 'any' });
      };

      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return the values when read successfuly', async () => {
      const { Sut, connection, schema, mockedReturnValue } = makeSut();
      const postgres = new Sut(connection, schema);

      postgres.read = jest.fn().mockReturnValue(mockedReturnValue);

      const result = await postgres.read({ id: 1 });
      expect(result).toStrictEqual(mockedReturnValue);
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
