import * as validationInit from '../utilities/validation-init';

const validateInputs = entity => (req, res, next) => {
  switch (entity) {
    case 'createUser':
      validationInit.userSignup(req, res, next);
      break;
    case 'loginUser':
      validationInit.userSignin(req, res, next);
      break;
    case 'createAccount':
      validationInit.createAccount(req, res, next);
      break;
    case 'changeAccountStatus':
      validationInit.changeAccountStatus(req, res, next);
      break;
    case 'postTransaction':
      validationInit.postTransaction(req, res, next);
      break;
    case 'accountNumberParam':
      validationInit.accountNumberParam(req, res, next);
      break;
    case 'idParam':
      validationInit.idParam(req, res, next);
      break;
    default:
  }
};

export default validateInputs;
