/* eslint-disable consistent-return */
/* eslint-disable default-case */
/* eslint-disable no-case-declarations */
import userSignup from '../utilities/validation-init';

const validateInputs = (entity) => {
  const validateInner = (req, res, next) => {
    switch (entity) {
      case 'createUser':
        userSignup(req, res, next);
        break;
    }
  };

  return validateInner;
};

export default validateInputs;
