/* eslint-disable consistent-return */
import Joi from 'joi';
import HttpResponse from './http-response';
import * as validationRule from './validation-rules';

const userSignup = (req, res, next) => {
  const clientInputs = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  };

  const schema = Joi.object({
    firstName: validationRule.requiredName('First name'),
    lastName: validationRule.requiredName('Last name'),
    phone: validationRule.phone('Phone'),
    email: validationRule.email('Email'),
    password: validationRule.password('Password'),
  });

  const { error } = Joi.validate(clientInputs, schema);

  if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });
  next();
};

const userSignin = (req, res, next) => {
  const loginCredentials = {
    email: req.body.email,
    password: req.body.password,
  };

  const schema = Joi.object().keys({
    email: validationRule.email('Your login email'),
    password: validationRule.password('Your login password'),
  });

  const { error } = Joi.validate(loginCredentials, schema);

  if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });
  next();
};

const createAccount = (req, res, next) => {
  const clientInputs = {
    ownerId: req.body.ownerId,
    accountType: req.body.accountType,
    openingBalance: req.body.openingBalance,
  };

  const schema = Joi.object({
    ownerId: validationRule.integer('Bank account owner'),
    accountType: validationRule.bankAccountType('Bank account type'),
    openingBalance: validationRule.float('Opening balance'),
  });

  const { error } = Joi.validate(clientInputs, schema);

  if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });
  next();
};

const changeAccountStatus = (req, res, next) => {
  const { error } = Joi.validate({
    accountNumber: req.params.accountNumber,
    newAccountStatus: req.body.accountStatus,
  }, Joi.object({
    accountNumber: validationRule.accountNumber('The specified account number'),
    newAccountStatus: validationRule.requiredStr('Account status'),
  }));

  if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });
  next();
};

const deleteAccount = (req, res, next) => {
  const { error } = Joi.validate({
    accountNumber: req.params.accountNumber,
  }, Joi.object().keys({
    accountNumber: validationRule.accountNumber('The specified account number'),
  }));

  if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });
  next();
};

const postTransaction = (req, res, next) => {
  const clientInputs = {
    accountNumber: req.params.accountNumber,
    amount: req.body.amount,
    type: req.body.type,
    cashier: req.body.cashier,
  };

  const schema = Joi.object().keys({
    accountNumber: validationRule.accountNumber('The specified account number'),
    amount: validationRule.float('The amount to transact with'),
    type: validationRule.transactionType('Transaction type'),
    cashier: validationRule.integer('Cashier value'),
  });

  const { error } = Joi.validate(clientInputs, schema);

  if (error) return HttpResponse.send(res, 422, { error: error.details[0].message });
  next();
};


export {
  userSignup,
  userSignin,
  createAccount,
  changeAccountStatus,
  deleteAccount,
  postTransaction,
};
