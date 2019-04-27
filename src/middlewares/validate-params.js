import ValidateParams from '../utilities/validation-init';

/**
 * Validates inputs from request parameters only depending on the parameter name
 *
 * @param {string} paramName - Name of the parameter
 */
const validateParams = paramName => (req, res, next) => {
  switch (paramName) {
    case 'email':
      ValidateParams.emailParam(req, res, next);
      break;
    case 'accountNumber':
      ValidateParams.accountNumberParam(req, res, next);
      break;
    case 'id':
      ValidateParams.idParam(req, res, next);
      break;
    default:
  }
};

export default validateParams;
