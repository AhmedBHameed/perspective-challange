import {ValidationError} from '@hapi/joi';
import {
  requiredTimestamp,
  requiredArrayOfFieldOptions,
  Joi,
  requiredObjectId,
  requiredNonEmptyString,
} from '../../util/joiValidation';
import {SessionInput} from './model/SessionInput';

interface ValidationResultData<T> {
  error?: ValidationError;
  errors?: ValidationError;
  warning?: ValidationError;
  value: T;
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

const validateMutateSessionInput = (data: SessionInput): ValidationResultData<SessionInput> => {
  return SessionValidationSchema.validate(data, {abortEarly: false});
};

export default validateMutateSessionInput;
