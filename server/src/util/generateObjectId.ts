import os from 'os';
import crypto from 'crypto';

/**
 * Generates a MongoDB-style ObjectId in Node.js. Uses nanosecond timestamp in place of counter;
 * should be impossible for same process to generate multiple objectId in same nanosecond? (clock
 * drift can result in an *extremely* remote possibility of id conflicts).
 * @see https://gist.github.com/chrisveness/7975c33ac569c124e4ceb11490576c67
 * @returns {string} Id in same format as MongoDB ObjectId.
 */
const objectId = () => {
  const seconds = Math.floor(+new Date() / 1000).toString(16);
  const machineId = crypto.createHash('md5').update(os.hostname()).digest('hex').slice(0, 6);
  const processId = process.pid.toString(16).slice(0, 4).padStart(4, '0');
  const counter = process.hrtime()[1].toString(16).slice(0, 6).padStart(6, '0');

  return seconds + machineId + processId + counter;
};

export default objectId;
