import {Document, model, Schema} from 'mongoose';
import {genTimestamp} from 'src/util/generateTimestamp';

export interface SessionModel {
  localId?: string;
  globalId?: string;
  profile?: Array<{
    fieldName: string;
    value: any;
  }>;
  createdAt?: Date;
  lastSeenAt?: Date;
  convertedAt?: Date;

  companyId?: string;
  workspaceId?: string;
  campaignId?: string;
  campaignVersionId?: string;
}

export interface Session extends SessionModel, Document {}

const SessionSchema: Schema = new Schema(
  {
    // _id field is configured by default.
    localId: {type: Schema.Types.String},
    globalId: {type: Schema.Types.String},

    profile: [
      {
        fieldName: {type: Schema.Types.String, required: true},
        value: {type: Schema.Types.Mixed},
      },
    ],

    lastSeenAt: {type: Schema.Types.Date},
    convertedAt: {type: Schema.Types.Date},

    companyId: {type: Schema.Types.ObjectId, required: true},
    workspaceId: {type: Schema.Types.ObjectId},
    campaignId: {type: Schema.Types.ObjectId, required: true},
    campaignVersionId: {type: Schema.Types.ObjectId, required: true},
  },
  {timestamps: true} // That will take care of both fields "createdAt" and "updatedAt"
);

SessionSchema.pre<Session>('save', function (this, next) {
  const utc: Date = genTimestamp().toString() as any; // timestamp. e.x: "1623292228285"
  if (!this['createdAt']) {
    this['createdAt'] = utc;
  }
  this['updatedAt'] = utc;
  next();
});

export default model<Session>('Session', SessionSchema);
