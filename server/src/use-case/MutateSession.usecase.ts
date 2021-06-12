import {
  Joi,
  requiredArrayOfFieldOptions,
  requiredObjectId,
  requiredNonEmptyString,
  requiredTimestamp,
} from '../util/joiValidation';
import sessionModel, {SessionModel} from 'src/database/Session.model';
import {uniqBy} from 'lodash';
import {ValidationError} from '@hapi/joi';
import logger from 'src/services/Logger';

interface ValidationResultData<T> {
  error?: ValidationError;
  errors?: ValidationError;
  warning?: ValidationError;
  value: T;
}

export interface FieldInput {
  fieldName: string;
  label: string;
  value: any;
}

interface SessionInput {
  timestamp: string;
  sentAt: string;
  properties: {
    trackingVersion: string;
    clientSessionId: string;
    clientPersistentId: string;
    pageId: string;
    companyId: string;
    campaignId: string;
    versionId: string;
    optIns: FieldInput[];
  };
  messageId: string;
}

const SessionValidationSchema = Joi.object<SessionInput>({
  timestamp: requiredTimestamp,
  sentAt: requiredTimestamp,
  properties: Joi.object({
    trackingVersion: requiredNonEmptyString,
    clientSessionId: requiredNonEmptyString,
    clientPersistentId: requiredNonEmptyString,
    pageId: requiredObjectId,
    companyId: requiredObjectId,
    campaignId: requiredObjectId,
    versionId: requiredObjectId,
    optIns: requiredArrayOfFieldOptions,
  }),
  messageId: requiredNonEmptyString,
});

class MutateSessionUseCase {
  public validate(data: SessionInput): ValidationResultData<SessionInput> {
    return SessionValidationSchema.validate(data, {abortEarly: false});
  }

  public async run(data: SessionInput): Promise<SessionModel | Error> {
    const {
      properties: {companyId, campaignId, versionId, optIns},
    } = data;

    try {
      const MutatedSession = await sessionModel.findOneAndUpdate(
        {companyId, campaignId, campaignVersionId: versionId},
        {
          profile: uniqBy(optIns, 'fieldName'),
          companyId,
          campaignId,
          campaignVersionId: versionId,
        },
        {upsert: true, new: true}
      );

      const result = await MutatedSession.save();
      return result;
    } catch (error) {
      logger.error('', error);
      return new Error(error.message);
    }
  }
}

const mutateSessionUseCase = new MutateSessionUseCase();
export default mutateSessionUseCase;
