import objectId from '../generateObjectId';

Date.now = jest.fn(() => new Date(Date.UTC(2017, 1, 14)).valueOf());

const mockObjectId = objectId();

describe('GenerateObjectId', () => {
  it('returns object id with length of 24', () => {
    expect(mockObjectId).toHaveLength(24);
  });
});
