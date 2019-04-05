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
};

export default account;
