import ActionsToValidate from '../utilities/validation-init';

/**
 * Validates inputs from request body and parameters depending on an action a user performs
 *
 * @param {string} action - Name of the action user wants to perform
 */
const validateInputs = action => (req, res, next) => {
  switch (action) {
    case 'createUser':
      ActionsToValidate.userSignup(req, res, next);
      break;
    case 'loginUser':
      ActionsToValidate.userSignin(req, res, next);
      break;
    case 'createAccount':
      ActionsToValidate.createAccount(req, res, next);
      break;
    case 'changeAccountStatus':
      ActionsToValidate.changeAccountStatus(req, res, next);
      break;
    case 'postTransaction':
      ActionsToValidate.postTransaction(req, res, next);
      break;
    default:
  }
};

export default validateInputs;
