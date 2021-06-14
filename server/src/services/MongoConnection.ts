import bluebird from 'bluebird';
import {connect, Mongoose, set} from 'mongoose';
import {logger} from '../services/Logger';

import environment from '../config/environment';

class MongoConnection {
  private _init() {
    bluebird.promisifyAll(Mongoose);
    set('useCreateIndex', true);
    set('useNewUrlParser', true);
    set('toObject', {
      virtuals: true,
      versionKey: false,
      transform: (_: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    });
    set('toJSON', {
      virtuals: true,
      versionKey: false,
      transform: (_: any, ret: any) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    });
  }

  /**
   * Connection ready state
   * 0 = disconnected
   * 1 = connected
   * 2 = connecting
   * 3 = disconnecting
   * Each state change emits its associated event name.
   */
  public async connect(): Promise<number> {
    this._init();
    try {
      const {dbName, password, port, server, user} = environment.database;

      const connection = await connect(`mongodb://${server}:${port}/${dbName}`, {
        user,
        pass: password,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      });
      return connection.connection.readyState;
    } catch (error) {
      logger.error('🔥 Database connection failed: %o', error);
      return -1;
    }
  }
}

const mongoConnection = new MongoConnection();
export default mongoConnection;
