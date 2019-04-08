/* eslint-disable default-case */
/* eslint-disable arrow-body-style */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
import Joi from 'joi';

const integer = (input) => {
  const customJoiError = Joi.string().required().regex(/^\d+$/)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'any.empty':
            return `${input} should not be empty`;
          case 'any.required':
            return `${input} is required`;
          case 'string.regex.base':
            return `${input} should be an integer`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const float = (input) => {
  const customJoiError = Joi.string().required()
    .regex(/^\d+(.){1}(\d){2}$/)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'any.empty':
            return `${input} should not be empty`;
          case 'any.required':
            return `${input} is required`;
          case 'string.regex.base':
            return `${input} should be a number rounded to two (2) decimal places`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const requiredStr = (input) => {
  const customJoiError = Joi.string().required().regex(/^[a-zA-Z]+$/)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'any.empty':
            return `${input} should not be empty`;
          case 'any.required':
            return `${input} is required`;
          case 'string.regex.base':
            return `${input} should contain alphabets only`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const requiredName = (input) => {
  const customJoiError = Joi.string().required().min(2).max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error((errors) => {
      return errors.map((err) => {
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
        }
      }).join(' and ');
    });

  return customJoiError;
};

const optionalName = (input) => {
  const customJoiError = Joi
    .string().allow('').min(2).max(50)
    .regex(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'string.min':
            return `${input} should have at least ${err.context.limit} characters`;
          case 'string.max':
            return `${input} should have at most ${err.context.limit} characters`;
          case 'string.regex.base':
            return `${input} should be a valid name`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const phone = (input) => {
  const customJoiError = Joi.string().required().length(11)
    .regex(/^\d{11}$/)
    .error((errors) => {
      return errors.map((err) => {
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
            return `${input} should be a valid phone number`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const accountNumber = (input) => {
  const customJoiError = Joi.string().required().length(10)
    .regex(/^\d{10}$/)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'string.base':
            return `${input} should be a string`;
          case 'any.required':
            return `${input} is required`;
          case 'any.empty':
            return `${input} should be not be empty`;
          case 'string.length':
            return `${input} should be ${err.context.limit} characters long`;
          case 'string.regex.base':
            return `${input} should contain numbers only and be 10 characters long`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const email = (input) => {
  const customJoiError = Joi.string().required().min(3).max(254)
    .regex(/^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/)
    .error((errors) => {
      return errors.map((err) => {
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
        }
      }).join(' and ');
    });

  return customJoiError;
};

const password = (input) => {
  const customJoiError = Joi.string().required().min(6).max(255)
    .error((errors) => {
      return errors.map((err) => {
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
        }
      }).join(' and ');
    });

  return customJoiError;
};

const bankAccountType = (input) => {
  const customJoiError = Joi.string().required()
    .regex(/^(savings)|(current)$/i)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'string.base':
            return `${input} should be a string`;
          case 'any.required':
            return `${input} is required`;
          case 'any.empty':
            return `${input} should be not be empty`;
          case 'string.regex.base':
            return `${input} should be either 'Savings' or 'Current'`;
        }
      }).join(' and ');
    });

  return customJoiError;
};

const transactionType = (input) => {
  const customJoiError = Joi.string().required()
    .regex(/^(debit)|(credit)$/i)
    .error((errors) => {
      return errors.map((err) => {
        switch (err.type) {
          case 'string.base':
            return `${input} should be a string`;
          case 'any.required':
            return `${input} is required`;
          case 'any.empty':
            return `${input} should be not be empty`;
          case 'string.regex.base':
            return `${input} should be either 'Debit' or 'Credit'`;
        }
      }).join(' and ');
    });

  return customJoiError;
};


export {
  integer,
  requiredStr,
  requiredName,
  optionalName,
  phone,
  accountNumber,
  email,
  password,
  bankAccountType,
  transactionType,
  float,
};
