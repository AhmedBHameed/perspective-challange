import {
  requiredObjectId,
  requiredTimestamp,
  requiredNonEmptyString,
  requiredArrayOfFieldOptions,
} from '../joiValidation';

describe('JoiValidation', () => {
  describe('[ObjectId validation]', () => {
    it('passes valid object id like "60c528c0e389a2fec8887ee3"', () => {
      const objectIdValue = '60c528c0e389a2fec8887ee3';
      const result = requiredObjectId.validate(objectIdValue);
      expect(result).toMatchObject({value: objectIdValue});
    });

    it('fails invalid object id like "60c528c0e389a2fec8887ee3TTT"', () => {
      const objectIdValue = '60c528c0e389a2fec8887ee3TTT';
      const result = requiredObjectId.validate(objectIdValue);
      expect(result.error?.details[0].message).toBe(
        `"value" with value "${objectIdValue}" fails to match the object id pattern`
      );
    });
  });

  describe('[Timestamp validation]', () => {
    it('passes valid date', () => {
      const date = new Date();
      const result = requiredTimestamp.validate(date);
      expect(result).toMatchObject({value: date});
    });

    it('fails invalid date', () => {
      const date = '';
      const result = requiredTimestamp.validate(date);
      expect(result.error?.details[0].message).toBe(`"value" must be a valid date`);
    });
  });

  describe('[RequiredString validation]', () => {
    it('passes valid date', () => {
      const date = 'Non empty string';
      const result = requiredNonEmptyString.validate(date);
      expect(result).toMatchObject({value: date});
    });

    it('fails invalid date', () => {
      const date = '';
      const result = requiredNonEmptyString.validate(date);
      expect(result.error?.details[0].message).toBe(`"value" is not allowed to be empty`);
    });
  });

  describe('[Required unique array of objects by field "fieldName" validation]', () => {
    it('passes valid date', () => {
      const date = [
        {
          fieldName: 'fullName',
          label: 'Full Name',
          value: 'Ahmed HAMEED',
        },
        {
          fieldName: 'email',
          label: 'Business Email',
          value: 'christoph@perspective.co',
        },
      ];
      const result = requiredArrayOfFieldOptions.validate(date);
      expect(result).toMatchObject({value: date});
    });

    it('fails invalid date', () => {
      const case1 = '';
      const case1Result = requiredArrayOfFieldOptions.validate(case1);
      expect(case1Result.error?.details[0].message).toBe(`"value" must be an array`);

      const case2 = [
        {
          fieldName: 'fullName',
          label: 'Full Name',
          value: 'Ahmed HAMEED',
        },
        {
          fieldName: 'fullName',
          label: 'Full Name',
          value: 'Ahmed HAMEED',
        },
        {
          fieldName: 'email',
          label: 'Business Email',
          value: 'christoph@perspective.co',
        },
      ];
      const case2Result = requiredArrayOfFieldOptions.validate(case2);
      expect(case2Result.error?.details[0].message).toBe(`"[1]" contains a duplicate value`);

      const case3 = undefined;
      const case3Result = requiredArrayOfFieldOptions.validate(case3);
      expect(case3Result.error?.details[0].message).toBe(`"value" is required`);
    });
  });
});
