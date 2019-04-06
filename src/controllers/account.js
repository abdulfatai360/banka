/* eslint-disable consistent-return */
import '@babel/polyfill';
import { userModel } from '../models/user';
import { accountModel } from '../models/account';

const account = {
  create(req, res) {
    // confirm if the owner specified in req's body exist
    const acctOwner = userModel.findById(Number(req.body.owner));

    if (!acctOwner) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The person you tried to open a bank account for does not exist',
      });
    }

    const acctInfo = accountModel.create({
      owner: Number(req.body.owner),
      type: req.body.type,
    });

    res.status(201).json({
      status: res.statusCode,
      data: {
        accountNumber: acctInfo.accountNumber,
        firstName: acctOwner.firstName,
        lastName: acctOwner.lastName,
        otherName: acctOwner.otherName,
        email: acctOwner.email,
        type: acctInfo.type,
        openingBalance: acctInfo.openingBalance,
      },
    });
  },

  changeStatus(req, res) {
    // get client inputs from req body and parameter
    const { accountNumber } = req.params;
    const newStatus = req.body.status;

    // confirm if the account record exist
    const acctInfo = accountModel.findByAccountNumber(accountNumber);
    if (!acctInfo) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The bank account record you wanted to change its status is incorrect',
      });
    }

    // grab the status prop of the acct number from account DB
    acctInfo.status = newStatus;

    // return the acct number and its new status in res body
    res.status(200).json({
      status: res.statusCode,
      data: {
        accountNumber: acctInfo.accountNumber,
        status: acctInfo.status,
      },
    });
  },
};

export default account;
