const isUUID = require('./validateUUID');
describe('isUUID function', () => {
  it('should export a isUUID function', () => {
    expect(isUUID).toBeInstanceOf(Function);
  });

  it('Should return false if is not an uuid', () => {
    const invalidUUID = 'anyInvalidUUID';
    const result = isUUID(invalidUUID);
    expect(result).toStrictEqual(false);
  });

  it('Should return true if is an uuid', () => {
    const validUUID = '19cb7c30-da60-45e4-b6ea-0a1f889da84c';
    const result = isUUID(validUUID);
    expect(result).toStrictEqual(true);
  });
});
