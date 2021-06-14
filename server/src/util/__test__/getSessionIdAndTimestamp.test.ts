import {getSessionIdAndTimestamp} from '../getSessionIdAndTimestamp';
import {genId, genDate} from '../../test/generate';

const mockPageId = genId();
const mockSentAt = +new Date(genDate());

const mockJobId = `${mockPageId}:${mockSentAt}`;

describe('GetSessionIdAndTimestamp', () => {
  it('returns [pageId, timestamp]', () => {
    expect(getSessionIdAndTimestamp(mockJobId)).toMatchObject([mockPageId, `${mockSentAt}`]);
  });
});
