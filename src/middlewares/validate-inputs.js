import ValidateActions from '../utilities/validation-init';

/**
 * Validates inputs from request body and parameters depending on an action a user performs
 *
 * @param {string} action - Name of the action user wants to perform
 */
const validateInputs = action => (req, res, next) => {
  switch (action) {
    case 'createUser':
      ValidateActions.validateSignup(req, res, next);
      break;
    case 'loginUser':
      ValidateActions.validateSignin(req, res, next);
      break;
    case 'createAccount':
      ValidateActions.validateAccountCreation(req, res, next);
      break;
    case 'changeAccountStatus':
      ValidateActions.validateAccountStatusChange(req, res, next);
      break;
    case 'postTransaction':
      ValidateActions.validationTransactionCreation(req, res, next);
      break;
    default:
  }
};

export default validateInputs;
