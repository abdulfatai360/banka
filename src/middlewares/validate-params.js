import * as validationInit from '../utilities/validation-init';

const validateParams = entity => (req, res, next) => {
  switch (entity) {
    case 'email':
      validationInit.emailParam(req, res, next);
      break;
    case 'accountNumber':
      validationInit.accountNumberParam(req, res, next);
      break;
    case 'id':
      validationInit.idParam(req, res, next);
      break;
    default:
  }
};

export default validateParams;
