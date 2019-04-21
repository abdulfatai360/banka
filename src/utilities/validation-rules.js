import Joi from 'joi';

// data categories
const simpleData = (input, pattern, type) => {
  let msg;

  if (type === 'int') msg = `${input} should be an integer and should not have space(s).`;
  if (type === 'float') msg = `${input} should be a number in 2 decimal places.`;
  if (type === 'simpleStr') msg = `${input} should contain alphabets only.`;
  if (type === 'acctType') msg = `${input} should be either 'Savings' or 'Current'.`;
  if (type === 'txnType') msg = `${input} should be either 'Debit' or 'Credit'.`;
  if (type === 'phone') msg = `${input} should be a valid phone number. It should be of this format: '+234xxxxxxxxxx' or '234xxxxxxxxxx'.`;

  return Joi.string().required().regex(pattern)
    .error((errors) => {
      const customMsgs = errors.map((err) => {
        switch (err.type) {
          case 'any.empty':
            return `${input} should not be empty`;
          case 'any.required':
            return `${input} is required`;
          case 'string.regex.base':
            return msg;
          default:
            return `Sorry, the ${input} you entered is invalid`;
        }
      });

      return customMsgs.join(' and ');
    });
};

const fixedLengthData = (input, len, pattern, type) => {
  let msg;

  if (type === 'acctNum') msg = `${input} should contain numbers only and be 10 characters long`;

  return Joi.string().required().length(len)
    .regex(pattern)
    .error((errors) => {
      const customMsgs = errors.map((err) => {
        switch (err.type) {
          case 'string.base':
            return `${input} should be a string`;
          case 'any.empty':
            return `${input} should be not be empty`;
          case 'any.required':
            return `${input} is required`;
          case 'string.length':
            return `${input} should be ${err.context.limit} characters long`;
          case 'string.regex.base':
            return msg;
          default:
            return `Sorry, the ${input} you entered is invalid`;
        }
      });

      return customMsgs.join(' and ');
    });
};

const integer = input => simpleData(input, /^[0-9]+$/, 'int');

const float = input => simpleData(input, /^[0-9]+[.]{1}[0-9]{2}$/, 'float');

const requiredStr = input => simpleData(input, /^[a-zA-Z]+$/, 'simpleStr');

const bankAccountType = input => simpleData(input, /^(savings)|(current)$/i, 'acctType');

const transactionType = input => simpleData(input, /^(debit)|(credit)$/i, 'txnType');

const phone = input => simpleData(input, /^(\+234|234)[0-9]{10}$/, 'phone');


const accountNumber = input => fixedLengthData(input, 10, /^[0-9]{10}$/, 'acctNum');

const requiredName = (input) => {
  const customJoiError = Joi.string().required().min(2).max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error((errors) => {
      const customMsgs = errors.map((err) => {
        switch (err.type) {
          case 'any.empty':
            return `${input} should not be empty`;
          case 'any.required':
            return `${input} is required`;
          case 'string.min':
            return `${input} should have at least ${err.context.limit} characters`;
          case 'string.max':
            return `${input} should have at most ${err.context.limit} characters`;
          case 'string.regex.base':
            return `${input} should be a valid name`;
          default:
            return `Sorry, the ${input} you entered is invalid`;
        }
      });

      return customMsgs.join(' and ');
    });

  return customJoiError;
};

const email = (input) => {
  const customJoiError = Joi.string().required().min(3).max(254)
    .regex(/^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/)
    .error((errors) => {
      const customMsgs = errors.map((err) => {
        switch (err.type) {
          case 'string.base':
            return `${input} should be a string`;
          case 'any.required':
            return `${input} is required`;
          case 'any.empty':
            return `${input} should be not be empty`;
          case 'string.min':
            return `${input} should have at least ${err.context.limit} characters`;
          case 'string.max':
            return `${input} should have at most ${err.context.limit} characters`;
          case 'string.regex.base':
            return `${input} should be a valid email address`;
          default:
            return `Sorry, the ${input} you entered is invalid`;
        }
      });

      return customMsgs.join(' and ');
    });

  return customJoiError;
};

const password = (input) => {
  const customJoiError = Joi.string().required().min(6).max(254)
    .error((errors) => {
      const customMsgs = errors.map((err) => {
        switch (err.type) {
          case 'string.base':
            return `${input} should be a string`;
          case 'any.required':
            return `${input} is required`;
          case 'any.empty':
            return `${input} should be not be empty`;
          case 'string.min':
            return `${input} should have at least ${err.context.limit} characters`;
          case 'string.max':
            return `${input} should have at most ${err.context.limit} characters`;
          default:
            return `Sorry, the ${input} you entered is invalid`;
        }
      });

      return customMsgs.join(' and ');
    });

  return customJoiError;
};

export {
  integer,
  float,
  requiredStr,
  bankAccountType,
  transactionType,
  phone,
  accountNumber,
  requiredName,
  email,
  password,
};
