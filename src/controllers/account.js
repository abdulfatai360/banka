/* eslint-disable consistent-return */
import '@babel/polyfill';
import { userModel } from '../models/user';
import { accountModel } from '../models/account';

const accountController = {
  create(req, res) {
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
      status: 'draft',
      openingBalance: 0.00,
      balance: 0.00,
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
    const { accountNumber } = req.params;
    const newStatus = req.body.status;

    const account = accountModel.findByAccountNumber(accountNumber);
    if (!account) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The bank account record you wanted to change its status is incorrect',
      });
    }

    account.status = newStatus;

    res.status(200).json({
      status: res.statusCode,
      data: {
        accountNumber: account.accountNumber,
        status: account.status,
      },
    });
  },

  delete(req, res) {
    const { accountNumber } = req.params;
    const account = accountModel.findByAccountNumber(accountNumber);

    if (!account) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The bank account record you wanted to delete is incorrect',
      });
    }

    accountModel.deleteOne({ accountNumber });

    res.status(200).json({
      status: res.statusCode,
      message: 'Bank account deleted successfully',
    });
  },
};

export default accountController;
