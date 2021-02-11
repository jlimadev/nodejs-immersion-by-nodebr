const Postgres = require('./postgres');

// Factory SUT = System Under Test
const makeSut = () => {
  const Sut = Postgres;
  const connection = Sut.connect();
  const schema = 'heroes';
  const mockInput = { name: 'any name', power: 'any power' };
  const errorMessage = 'Any Error';

  return { Sut, connection, schema, mockInput, errorMessage };
};

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

      postgres.create = jest.fn(() => Promise.reject(new Error(errorMessage)));

      // Act
      const act = async () => {
        await postgres.create({});
      };

      // Assert
      await expect(act).rejects.toThrow(errorMessage);
    });

    it('Should return an object with the inserted data', async () => {
      // Arrange
      const { Sut, connection, schema, mockInput } = makeSut();
      const postgres = new Sut(connection, schema);
      const mockedReturnValue = { id: 1, ...mockInput };
      postgres.create = jest.fn().mockReturnValue(mockedReturnValue);

      // Act
      const result = await postgres.create(mockInput);

      // Assert
      expect(result).toStrictEqual(mockedReturnValue);
    });
  });
});
