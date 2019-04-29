import Joi from 'joi';
import HttpResponse from './http-response';
import ValidationRules from './validation-rules';

/**
 * Contains methods that make use of different schemas for validating client inputs
 *
 * @class ActionsToValidate
 */
class ValidateActions {
  /**
   * Set up schema to validate inputs when user wants to sign up
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static validateSignup(req, res, next) {
    const clientInputs = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
    };

    const schema = Joi.object({
      firstName: ValidationRules.requiredName('First name'),
      lastName: ValidationRules.requiredName('Last name'),
      phone: ValidationRules.phone('Phone'),
      email: ValidationRules.email('Email'),
      password: ValidationRules.password('Password'),
    });

    const { error } = Joi.validate(clientInputs, schema, { abortEarly: false });
    if (error) {
      return HttpResponse.send(res, 422, {
        errors: error.details.map(detail => detail.message),
      });
    }

    return next();
  }

  /**
   * Set up schema to validate inputs when user wants to sign in
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static validateSignin(req, res, next) {
    const loginCredentials = {
      email: req.body.email,
      password: req.body.password,
    };

    const schema = Joi.object().keys({
      email: ValidationRules.email('Email'),
      password: ValidationRules.password('Password'),
    });

    const { error } = Joi.validate(loginCredentials, schema, { abortEarly: false });
    if (error) {
      return HttpResponse.send(res, 422, {
        errors: error.details.map(detail => detail.message),
      });
    }

    return next();
  }

  /**
   * Set up schema to validate inputs when user wants to create an account
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static validateAccountCreation(req, res, next) {
    const clientInputs = {
      accountType: req.body.accountType,
      openingBalance: req.body.openingBalance,
    };

    const schema = Joi.object({
      accountType: ValidationRules.bankAccountType('Account type'),
      openingBalance: ValidationRules.float('Opening balance'),
    });

    const { error } = Joi.validate(clientInputs, schema, { abortEarly: false });
    if (error) {
      return HttpResponse.send(res, 422, {
        errors: error.details.map(detail => detail.message),
      });
    }

    return next();
  }

  /**
   * Set up schema to validate inputs when admin wants to change account status
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static validateAccountStatusChange(req, res, next) {
    const inputs = {
      accountNumber: req.params.accountNumber,
      newAccountStatus: req.body.accountStatus,
    };

    const schema = Joi.object({
      accountNumber: ValidationRules.accountNumber('Account number'),
      newAccountStatus: ValidationRules.accountStatus('Account status'),
    });

    const { error } = Joi.validate(inputs, schema, { abortEarly: false });
    if (error) {
      return HttpResponse.send(res, 422, {
        errors: error.details.map(detail => detail.message),
      });
    }

    return next();
  }

  /**
   * Set up schema to validate inputs when cashier wants to effect a transaction
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static validationTransactionCreation(req, res, next) {
    const clientInputs = {
      accountNumber: req.params.accountNumber,
      amount: req.body.amount,
      transactionType: req.body.transactionType,
    };

    const schema = Joi.object().keys({
      accountNumber: ValidationRules.accountNumber('Account number'),
      amount: ValidationRules.float('Amount'),
      transactionType: ValidationRules.transactionType('Transaction type'),
    });

    const { error } = Joi.validate(clientInputs, schema, { abortEarly: false });
    if (error) {
      return HttpResponse.send(res, 422, {
        errors: error.details.map(detail => detail.message),
      });
    }

    return next();
  }

  /**
   * Set up schema to validate account number parameter
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static accountNumberParam(req, res, next) {
    const inputs = { accountNumber: req.params.accountNumber };
    const schema = Joi.object().keys({ accountNumber: ValidationRules.accountNumber('Account number') });

    const { error } = Joi.validate(inputs, schema);
    if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });

    return next();
  }

  /**
   * Set up schema to validate id parameter
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static idParam(req, res, next) {
    const clientInputs = { id: req.params.id };
    const schema = Joi.object().keys({ id: ValidationRules.integer('Id') });

    const { error } = Joi.validate(clientInputs, schema);
    if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });

    return next();
  }

  /**
   * Set up schema to validate email parameter
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function for passing control to next middleware
   * @returns {}
   * @memberof ValidateActions
   */
  static emailParam(req, res, next) {
    const clientInputs = { email: req.params.userEmailAddress };
    const schema = Joi.object().keys({ email: ValidationRules.email('Email') });

    const { error } = Joi.validate(clientInputs, schema);
    if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });

    return next();
  }
}

export default ValidateActions;
