/* eslint-disable consistent-return */
import '@babel/polyfill';
import { userModel } from '../models/user';
import { accountModel } from '../models/account';

const accountController = {
  create(req, res) {
    // confirm if the owner specified in req's body exist
    const accountOwner = userModel.findById(Number(req.body.owner));

    if (!accountOwner) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The person you tried to open a bank account for does not exist',
      });
    }

    const accountInfo = accountModel.create({
      owner: Number(req.body.owner),
      type: req.body.type,
    });

    res.status(201).json({
      status: res.statusCode,
      data: {
        accountNumber: accountInfo.accountNumber,
        firstName: accountOwner.firstName,
        lastName: accountOwner.lastName,
        otherName: accountOwner.otherName,
        email: accountOwner.email,
        type: accountInfo.type,
        openingBalance: accountInfo.openingBalance,
      },
    });
  },

  changeStatus(req, res) {
    // get client inputs from req body and parameter
    const { accountNumber } = req.params;
    const newStatus = req.body.status;

    // confirm if the account record exist
    const account = accountModel.findByAccountNumber(accountNumber);
    if (!account) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The bank account record you wanted to change its status is incorrect',
      });
    }

    // update the status of the account number record
    account.status = newStatus;

    // return the acct number and its new status in res body
    res.status(200).json({
      status: res.statusCode,
      data: {
        accountNumber: account.accountNumber,
        status: account.status,
      },
    });
  },

  delete(req, res) {
    // confirm if the specified account number record exist
    const { accountNumber } = req.params;
    const account = accountModel.findByAccountNumber(accountNumber);

    if (!account) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The bank account record you wanted to delete is incorrect',
      });
    }

    // then delete the account record from DB
    accountModel.deleteOne({ accountNumber });

    res.status(200).json({
      status: res.statusCode,
      message: 'Bank account deleted successfully',
    });
  },
};

export default accountController;
