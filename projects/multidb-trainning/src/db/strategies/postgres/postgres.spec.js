const Postgres = require('./postgres');

// Factory SUT = System Under Test
const makeSut = () => {
  const Sut = Postgres;
  const connection = Sut.connect();
  const schema = 'heroes';

  return { Sut, connection, schema };
};

describe('Constructor', () => {
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
