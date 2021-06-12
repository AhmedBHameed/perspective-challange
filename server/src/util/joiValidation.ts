import Joi from '@hapi/joi';
import {FieldInput} from 'src/use-case/MutateSession.usecase';

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
  .unique((a: FieldInput, b: FieldInput) => a.fieldName?.toLowerCase() === b.fieldName?.toLowerCase());

export {Joi, requiredObjectId, requiredNonEmptyString, requiredTimestamp, requiredArrayOfFieldOptions};
