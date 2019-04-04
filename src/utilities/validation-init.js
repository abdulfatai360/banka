/* eslint-disable consistent-return */
import Joi from 'joi';
import {
  requiredName, optionalName, phone, email, password,
} from './validation-rules';

const userSignup = (req, res, next) => {
  const userEntity = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    otherName: req.body.otherName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  };

  const schema = Joi.object({
    firstName: requiredName('First name'),
    lastName: requiredName('Last name'),
    otherName: optionalName('Other name'),
    phone: phone('Phone'),
    email: email('Email'),
    password: password('Password'),
  });

  const { error } = Joi.validate(userEntity, schema);

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};


export default userSignup;
