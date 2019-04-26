import ActionsToValidate from '../utilities/validation-init';

/**
 * Validates inputs from request parameters only depending on the parameter name
 *
 * @param {string} paramName - Name of the parameter
 */
const validateParams = paramName => (req, res, next) => {
  switch (paramName) {
    case 'email':
      ActionsToValidate.emailParam(req, res, next);
      break;
    case 'accountNumber':
      ActionsToValidate.accountNumberParam(req, res, next);
      break;
    case 'id':
      ActionsToValidate.idParam(req, res, next);
      break;
    default:
  }
};

export default validateParams;
