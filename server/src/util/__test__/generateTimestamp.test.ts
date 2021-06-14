import {genTimestamp} from '../generateTimestamp';

const mockTimestamp = genTimestamp();
const mockExpectedResult = +new Date();

describe('GenerateTimestamp', () => {
  it('returns time stamp', () => {
    expect(mockTimestamp).toBe(mockExpectedResult);
  });
});
