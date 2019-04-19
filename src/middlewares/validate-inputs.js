import * as validationInit from '../utilities/validation-init';

const validateInputs = (entity) => {
  const validateInner = (req, res, next) => {
    switch (entity) {
      case 'createUser':
        validationInit.userSignup(req, res, next);
        break;
      case 'loginUser':
        validationInit.userSignin(req, res, next);
        break;
      case 'createBankAccount':
        validationInit.createAccount(req, res, next);
        break;
      case 'changeBankAccountStatus':
        validationInit.changeAccountStatus(req, res, next);
        break;
      case 'deleteBankAccount':
        validationInit.deleteAccount(req, res, next);
        break;
      case 'postTransaction':
        validationInit.postTransaction(req, res, next);
        break;
      default:
    }
  };

  return validateInner;
};

export default validateInputs;
