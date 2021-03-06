import Joi from 'joi';

/**
 * Generates and returns JOI object schema with custom error messages for simple data type
 *
 * @param {string} input - Name of field to validate its value
 * @param {RegExp} pattern - Regular expression object for validating the input
 * @param {string} type - Name of the data type
 * @returns {object}
 */
const simpleData = (input, pattern, type) => {
  let msg;

  if (type === 'integer') msg = `${input} is invalid`;
  if (type === 'float') msg = `${input} is invalid`;
  if (type === 'accountStatus') msg = `${input} should be either 'active' or 'dormant`;
  if (type === 'accountType') msg = `${input} should be either 'savings' or 'current'`;
  if (type === 'transactionType') msg = `${input} should be either 'debit' or 'credit'`;
  if (type === 'phone') msg = `${input} is invalid (acceptable formats: +234########## or 234##########)`;

  return Joi.string().required().regex(pattern)
    .regex(/\s/, { invert: true })
    .error((errors) => {
      errors.forEach((error) => {
        const err = error;
        switch (err.type) {
          case 'any.empty':
            err.message = `${input} should not be empty`;
            break;
          case 'any.required':
            err.message = `${input} is required`;
            break;
          case 'string.regex.base':
            err.message = msg;
            break;
          case 'string.regex.invert.base':
            err.message = `${input} should not contain spaces`;
            break;
          default:
            break;
        }
      });

      return errors;
    });
};

/**
 * Generates and returns JOI object schema with custom error messages for name and email data
 *
 * @param {string} input - Name of field to validate its value
 * @param {RegExp} pattern - Regular expression object for validating the input
 * @param {string} type - Name of the data type
 * @param {number} min - Represent minimum length of the value
 * @param {number} max - Represent maximum length of the value
 * @returns {object}
 */
const nameAndEmail = (input, pattern, type, min, max) => {
  let msg;

  if (type === 'name') msg = `${input} should be a valid name`;
  if (type === 'email') msg = `${input} should be a valid email address`;

  return Joi.string().required().min(min).max(max)
    .regex(pattern)
    .error((errors) => {
      errors.forEach((error) => {
        const err = error;
        switch (err.type) {
          case 'any.empty':
            err.message = `${input} should not be empty`;
            break;
          case 'any.required':
            err.message = `${input} is required`;
            break;
          case 'string.min':
            err.message = `${input} should have at least ${err.context.limit} characters`;
            break;
          case 'string.max':
            err.message = `${input} should have at most ${err.context.limit} characters`;
            break;
          case 'string.regex.base':
            err.message = msg;
            break;
          default:
            break;
        }
      });

      return errors;
    });
};
class ValidationRules {
  /**
   * Returns JOI object schema for validating an integer number
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static integer(input) {
    return simpleData(input, /^[0-9]+$/, 'integer');
  }

  /**
   * Returns JOI object schema for validating a float number
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static float(input) {
    return simpleData(input, /^([0-9]*[.])?[0-9]+$/, 'float');
  }

  /**
   * Returns JOI object schema for validating a string that is required
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static accountStatus(input) {
    return simpleData(input, /^(active|dormant)$/i, 'accountStatus');
  }

  /**
   * Returns JOI object schema for validating a bank account type
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static bankAccountType(input) {
    const pattern = /^(savings|current)$/i;
    return simpleData(input, pattern, 'accountType');
  }

  /**
   * Returns JOI object schema for validating a bank transaction type
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static transactionType(input) {
    const pattern = /^(debit|credit)$/i;
    return simpleData(input, pattern, 'transactionType');
  }

  /**
   * Returns JOI object schema for validating a Nigerian phone number
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static phone(input) {
    const pattern = /^(\+234|234)[0-9]{10}$/;
    return simpleData(input, pattern, 'phone');
  }

  /**
   * Returns JOI object schema for validating an account number
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static accountNumber(input) {
    return Joi.string().required()
      .regex(/^[0-9]{10}$/).regex(/\s/, { invert: true })
      .error((errors) => {
        errors.forEach((error) => {
          const err = error;
          switch (err.type) {
            case 'any.required':
              err.message = `${input} is required`;
              break;
            case 'string.regex.base':
              err.message = `${input} should be a valid account number`;
              break;
            case 'string.regex.invert.base':
              err.message = `${input} should not contain spaces`;
              break;
            default:
              break;
          }
        });

        return errors;
      });
  }

  /**
   * Returns JOI object schema for validating first and last name
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static requiredName(input) {
    const pattern = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;
    return nameAndEmail(input, pattern, 'name', 2, 50);
  }

  /**
   * Returns JOI object schema for validating an email
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static email(input) {
    const pattern = /^[\w._]+@[\w]+[-.]?[\w]+\.[\w]+$/;
    return nameAndEmail(input, pattern, 'email', 3, 254);
  }

  /**
   * Returns JOI object schema for validating a password
   *
   * @static
   * @param {string} input - Name of field to validate its value
   * @returns {object}
   * @memberof ValidationRules
   */
  static password(input) {
    return Joi.string().required().min(6).max(254)
      .regex(/\s/, { invert: true })
      .error((errors) => {
        errors.forEach((error) => {
          const err = error;
          switch (err.type) {
            case 'any.required':
              err.message = `${input} is required`;
              break;
            case 'any.empty':
              err.message = `${input} should be not be empty`;
              break;
            case 'string.min':
              err.message = `${input} should have at least ${err.context.limit} characters`;
              break;
            case 'string.max':
              err.message = `${input} should have at most ${err.context.limit} characters`;
              break;
            case 'string.regex.invert.base':
              err.message = `${input} should not contain spaces`;
              break;
            default:
              break;
          }
        });

        return errors;
      });
  }
}

export default ValidationRules;
