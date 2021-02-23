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

describe('Postgres', () => {
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
        expect(defineModelMockedFunctions.create).toHaveBeenCalledWith(
          mockInput,
        );
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

        await expect(act).rejects.toThrow(
          'Error on reading data from postgres',
        );
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
        const {
          Sut,
          connection,
          schema,
          errorMessage,
          defineModelMockedFunctions,
          mockUUID,
          mockUpdate,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        defineModelMockedFunctions.update = jest.fn(() =>
          Promise.reject(new Error(errorMessage)),
        );

        const act = async () => {
          await postgres.update(mockUUID, mockUpdate);
        };

        await expect(act).rejects.toThrow('Error on update data on postgres');
        expect(defineModelMockedFunctions.update).toHaveBeenCalled();
      });

      it('Should return an error if is not an UUID', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUpdate,
          defineModelMockedFunctions,
        } = await makeSut();

        const postgres = new Sut(connection, schema);

        const act = async () => {
          await postgres.update('InvalidUUID', mockUpdate);
        };

        await expect(act).rejects.toThrow('This id is not an UUID');
        expect(defineModelMockedFunctions.update).not.toHaveBeenCalled();
      });

      it('Should return an error if id is missing', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUpdate,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        const act = async () => {
          await postgres.update(undefined, mockUpdate);
        };

        await expect(act).rejects.toThrow(
          'You must inform the id and the item',
        );
        expect(defineModelMockedFunctions.update).not.toHaveBeenCalled();
      });

      it('Should return an error if body is missing', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUUID,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        const act = async () => {
          await postgres.update(mockUUID, undefined);
        };

        await expect(act).rejects.toThrow(
          'You must inform the id and the item',
        );
        expect(defineModelMockedFunctions.update).not.toHaveBeenCalled();
      });

      it('Should return [ 1 ] if updated successfuly', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUUID,
          mockUpdate,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);
        const expectedUpdatedResponse = [{ id: mockUUID, ...mockUpdate }];

        defineModelMockedFunctions.update = jest.fn().mockReturnValue('[ 1 ]');
        defineModelMockedFunctions.findAll = jest
          .fn()
          .mockReturnValue(expectedUpdatedResponse);

        const result = await postgres.update(mockUUID, mockUpdate);
        const readUpdatedValue = await postgres.read(mockUUID);

        expect(result).toStrictEqual('[ 1 ]');

        expect(readUpdatedValue).toStrictEqual(expectedUpdatedResponse);
        expect(Array.isArray(readUpdatedValue)).toBe(true);

        expect(defineModelMockedFunctions.update).toHaveBeenCalled();
        expect(
          defineModelMockedFunctions.update,
        ).toHaveBeenCalledWith(mockUpdate, { where: { id: mockUUID } });
        expect(defineModelMockedFunctions.findAll).toHaveBeenCalled();
      });

      it('Should return [ 0 ] if try to update an non existing Id', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUUID,
          mockUpdate,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        defineModelMockedFunctions.update = jest.fn().mockReturnValue('[ 0 ]');

        const result = await postgres.update(mockUUID, mockUpdate);

        expect(result).toStrictEqual('[ 0 ]');

        expect(defineModelMockedFunctions.update).toHaveBeenCalled();
        expect(
          defineModelMockedFunctions.update,
        ).toHaveBeenCalledWith(mockUpdate, { where: { id: mockUUID } });
      });
    });

    describe('delete', () => {
      it('Should return an error if delete fails or rejects', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUUID,
          errorMessage,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        defineModelMockedFunctions.destroy = jest.fn(() =>
          Promise.reject(new Error(errorMessage)),
        );

        const act = async () => {
          await postgres.delete(mockUUID);
        };

        await expect(act).rejects.toThrow('Error on delete data on postgres');
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalled();
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalledWith({
          where: { id: mockUUID },
        });
      });

      it('Should return an error if is not an UUID', async () => {
        const { Sut, connection, schema } = await makeSut();
        const postgres = new Sut(connection, schema);

        const act = async () => {
          await postgres.delete('InvalidUUID');
        };

        await expect(act).rejects.toThrow('This id is not an UUID');
      });

      it('Should return 1 if deleted successfuly (when send id)', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUUID,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        defineModelMockedFunctions.destroy = jest.fn().mockReturnValue(1);

        const result = await postgres.delete(mockUUID);

        expect(result).toStrictEqual(1);
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalled();
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalledWith({
          where: { id: mockUUID },
        });
      });

      it('Should return 0 if nothing is deleted', async () => {
        const {
          Sut,
          connection,
          schema,
          mockUUID,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        defineModelMockedFunctions.destroy = jest.fn().mockReturnValue(0);

        const result = await postgres.delete(mockUUID);

        expect(result).toStrictEqual(0);
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalled();
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalledWith({
          where: { id: mockUUID },
        });
      });

      it('Should delete everything if no id is sent', async () => {
        const {
          Sut,
          connection,
          schema,
          defineModelMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        defineModelMockedFunctions.destroy = jest
          .fn()
          .mockReturnValue('anyDeleteCount');

        const result = await postgres.delete();

        expect(result).toStrictEqual('anyDeleteCount');
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalled();
        expect(defineModelMockedFunctions.destroy).toHaveBeenCalledWith({
          where: {},
        });
      });
    });

    describe('isConnected', () => {
      it('should return an error if authenticate throws an error', async () => {
        const {
          Sut,
          connection,
          schema,
          errorMessage,
          sequelizeMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        sequelizeMockedFunctions.authenticate = jest.fn(() =>
          Promise.reject(new Error(errorMessage)),
        );

        const act = async () => await postgres.isConnected();

        expect(act).rejects.toThrow('Error to authenticate on postgres');
        expect(sequelizeMockedFunctions.authenticate).toHaveBeenCalled();
      });

      it('should return true if authenticate', async () => {
        const {
          Sut,
          connection,
          schema,
          sequelizeMockedFunctions,
        } = await makeSut();
        const postgres = new Sut(connection, schema);

        const result = await postgres.isConnected();

        expect(result).toBe(true);
        expect(sequelizeMockedFunctions.authenticate).toHaveBeenCalled();
      });
    });
  });

  describe('Satic Methods', () => {
    describe('connect', () => {
      it('should return an error if connect fails', async () => {
        const { Sut, errorMessage } = await makeSut();

        Sequelize.mockImplementationOnce(
          jest.fn(() => {
            throw new Error(errorMessage);
          }),
        );

        const act = () => {
          Sut.connect();
        };

        expect(act).toThrow('Error on connect with postgres');
      });

      it('should connect successfuly and return the connection', async () => {
        const { Sut, sequelizeMockedFunctions } = await makeSut();

        const result = Sut.connect();

        expect(result).toStrictEqual(sequelizeMockedFunctions);
      });
    });

    describe('disconnect', () => {
      it('Should throw an error if fails on close connection', async () => {
        const {
          Sut,
          connection,
          sequelizeMockedFunctions,
          errorMessage,
        } = await makeSut();

        sequelizeMockedFunctions.close = jest.fn(() => {
          throw new Error(errorMessage);
        });

        const act = () => {
          Sut.disconnect(connection);
        };

        expect(act).toThrow('Error on close connection with postgres');
        expect(sequelizeMockedFunctions.close).toHaveBeenCalled();
      });

      it("Should throw an error if don't pass the connection", async () => {
        const { Sut, sequelizeMockedFunctions } = await makeSut();

        const act = () => {
          Sut.disconnect();
        };

        expect(act).toThrow('You must inform the connection to be closed');
        expect(sequelizeMockedFunctions.close).not.toHaveBeenCalled();
      });

      it('Should rerturn true on close connection successfuly', async () => {
        const { Sut, connection, sequelizeMockedFunctions } = await makeSut();

        sequelizeMockedFunctions.close = jest.fn(() => true);

        const result = Sut.disconnect(connection);

        expect(result).toBe(true);
        expect(sequelizeMockedFunctions.close).toHaveBeenCalled();
      });
    });

    describe('defineModel', () => {
      it("should throw an error if don't pass the connection", async () => {
        const { Sut, sequelizeMockedFunctions, schema } = await makeSut();

        sequelizeMockedFunctions.define = jest.fn();
        const act = async () => {
          await Sut.defineModel(undefined, schema);
        };

        await expect(act).rejects.toThrow(
          'You must inform the connection and schema',
        );
        expect(sequelizeMockedFunctions.define).not.toHaveBeenCalled();
      });

      it("should throw an error if don't pass the schema", async () => {
        const { Sut, sequelizeMockedFunctions, connection } = await makeSut();

        sequelizeMockedFunctions.define = jest.fn();
        const act = async () => {
          await Sut.defineModel(connection, undefined);
        };

        await expect(act).rejects.toThrow(
          'You must inform the connection and schema',
        );
        expect(sequelizeMockedFunctions.define).not.toHaveBeenCalled();
      });

      it('should throw an error if define returns any error', async () => {
        const {
          Sut,
          sequelizeMockedFunctions,
          defineModelMockedFunctions,
          connection,
          schema,
          errorMessage,
        } = await makeSut();

        sequelizeMockedFunctions.define = jest.fn(() => {
          throw new Error(errorMessage);
        });

        const act = async () => {
          await Sut.defineModel(connection, schema);
        };

        await expect(act).rejects.toThrow(
          'Error on define model to postgres/sequelize',
        );
        expect(sequelizeMockedFunctions.define).toHaveBeenCalled();
        expect(defineModelMockedFunctions.sync).toHaveBeenCalled();
      });

      it('should throw an error if sync returns any error', async () => {
        const {
          Sut,
          sequelizeMockedFunctions,
          defineModelMockedFunctions,
          connection,
          schema,
          errorMessage,
        } = await makeSut();

        defineModelMockedFunctions.sync = jest.fn(() => {
          throw new Error(errorMessage);
        });

        const act = async () => {
          await Sut.defineModel(connection, schema);
        };

        await expect(act).rejects.toThrow(
          'Error on define model to postgres/sequelize',
        );
        expect(sequelizeMockedFunctions.define).toHaveBeenCalled();
        expect(defineModelMockedFunctions.sync).toHaveBeenCalled();
      });

      it('should return the model on success', async () => {
        const {
          Sut,
          sequelizeMockedFunctions,
          defineModelMockedFunctions,
          connection,
          schema,
        } = await makeSut();

        defineModelMockedFunctions.sync = jest
          .fn()
          .mockReturnValue(defineModelMockedFunctions);

        const result = await Sut.defineModel(connection, schema);

        expect(result).toStrictEqual(defineModelMockedFunctions);
        expect(defineModelMockedFunctions.sync).toHaveBeenCalled();
        expect(sequelizeMockedFunctions.define).toHaveBeenCalled();
        expect(sequelizeMockedFunctions.define).toHaveBeenCalledWith(
          schema.name,
          schema.schema,
          schema.options,
        );
      });
    });
  });
});
