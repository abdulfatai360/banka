/* eslint-disable consistent-return */
import Joi from 'joi';
import {
  requiredName, optionalName, phone, email, password, integer, float,
  bankAccountType, accountNumber, transactionType, requiredStr,
} from './validation-rules';

const userSignup = (req, res, next) => {
  const clientInputs = {
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

  const { error } = Joi.validate(clientInputs, schema);

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const userSignin = (req, res, next) => {
  const loginCredentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const schema = Joi.object().keys({
    email: email('Your login email'),
    password: password('Your login password'),
  });

  const { error } = Joi.validate(loginCredentials, schema);

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const createAccount = (req, res, next) => {
  const clientInputs = {
    owner: req.body.owner,
    type: req.body.type,
  };

  const schema = Joi.object({
    owner: integer('Bank account owner'),
    type: bankAccountType('Bank account type'),
  });

  const { error } = Joi.validate(clientInputs, schema);

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const changeAccountStatus = (req, res, next) => {
  const { error } = Joi.validate({
    accountNumber: req.params.accountNumber,
    newAccountStatus: req.body.status,
  }, Joi.object({
    accountNumber: accountNumber('The specified account number'),
    newAccountStatus: requiredStr('Account status'),
  }));

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const deleteAccount = (req, res, next) => {
  const { error } = Joi.validate({
    accountNumber: req.params.accountNumber,
  }, Joi.object().keys({
    accountNumber: accountNumber('The specified account number'),
  }));

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};

const postTransaction = (req, res, next) => {
  const clientInputs = {
    accountNumber: req.params.accountNumber,
    amount: req.body.amount,
    type: req.body.type,
    cashier: req.body.cashier,
  };

  const schema = Joi.object().keys({
    accountNumber: accountNumber('The specified account number'),
    amount: float('The amount to transact with'),
    type: transactionType('Transaction type'),
    cashier: integer('Cashier value'),
  });

  const { error } = Joi.validate(clientInputs, schema);

  if (error) {
    res.status(422).json({
      status: res.statusCode,
      error: error.details[0].message,
    });
  } else {
    next();
  }
};


export {
  userSignup,
  userSignin,
  createAccount,
  changeAccountStatus,
  deleteAccount,
  postTransaction,
};
