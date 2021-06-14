import Joi from '@hapi/joi';
import {FieldInput} from '../use-case/MutateSession/model/SessionInput';

const requiredObjectId = Joi.string().pattern(new RegExp('^[0-9a-fA-F]{24}$'), 'object id').required();
const requiredTimestamp = Joi.date();
const requiredNonEmptyString = Joi.string().required();
const requiredArrayOfFieldOptions = Joi.array()
  .items(
    Joi.object({
      fieldName: requiredNonEmptyString,
      label: requiredNonEmptyString,
      value: requiredNonEmptyString,
    })
  )
  .required()
  .unique((a: FieldInput, b: FieldInput) => a.fieldName?.toLowerCase() === b.fieldName?.toLowerCase());

export {Joi, requiredObjectId, requiredNonEmptyString, requiredTimestamp, requiredArrayOfFieldOptions};
