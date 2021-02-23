const ICrud = require('./ICrud');

describe('ICrud', () => {
  it('Should be instance of object', async () => {
    const crud = new ICrud();
    expect(crud).toBeInstanceOf(Object);
  });

  it('Should have the functions on the instace', async () => {
    const crud = new ICrud();
    expect(crud.create).toBeInstanceOf(Function);
    expect(crud.read).toBeInstanceOf(Function);
    expect(crud.update).toBeInstanceOf(Function);
    expect(crud.delete).toBeInstanceOf(Function);
    expect(crud.isConnected).toBeInstanceOf(Function);
    expect(ICrud.connect).toBeInstanceOf(Function);
    expect(ICrud.disconnect).toBeInstanceOf(Function);
  });

  it('should return a NotImplementedExpection on create', () => {
    const crud = new ICrud();
    const act = () => {
      crud.create();
    };
    expect(act).toThrow('Not Implemented Exception');
  });

  it('should return a NotImplementedExpection on read', () => {
    const crud = new ICrud();
    const act = () => {
      crud.read();
    };
    expect(act).toThrow('Not Implemented Exception');
  });

  it('should return a NotImplementedExpection on update', () => {
    const crud = new ICrud();
    const act = () => {
      crud.update();
    };
    expect(act).toThrow('Not Implemented Exception');
  });

  it('should return a NotImplementedExpection on delete', () => {
    const crud = new ICrud();
    const act = () => {
      crud.delete();
    };
    expect(act).toThrow('Not Implemented Exception');
  });

  it('should return a NotImplementedExpection on isConnected', () => {
    const crud = new ICrud();
    const act = () => {
      crud.isConnected();
    };
    expect(act).toThrow('Not Implemented Exception');
  });

  it('should return a NotImplementedExpection on connect', () => {
    const act = () => {
      ICrud.connect();
    };

    expect(act).toThrow('Not Implemented Exception');
  });

  it('should return a NotImplementedExpection on disconnect', () => {
    const act = () => {
      ICrud.disconnect();
    };

    expect(act).toThrow('Not Implemented Exception');
  });
});
