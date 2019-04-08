/* eslint-disable consistent-return */
import '@babel/polyfill';
import { transactionModel } from '../models/transaction';
import { accountModel } from '../models/account';
import convertTo2dp from '../utilities/convert-to-2dp';
import { userModel } from '../models/user';

const txnInit = (req, res) => {
  const { accountNumber } = req.params;

  const account = accountModel.findByAccountNumber(accountNumber);
  const cashier = userModel.findCashierById(Number(req.body.cashier));

  return { account, cashier };
};

const saveAndReturnTxnDetails = (req, res, oldBalance, account) => {
  const transactionData = {
    type: req.body.type,
    accountNumber: req.params.accountNumber,
    cashier: Number(req.body.cashier),
    amount: convertTo2dp(req.body.amount),
    oldBalance: convertTo2dp(oldBalance),
    newBalance: convertTo2dp(account.balance),
  };

  return res.status(201).json({
    status: res.statusCode,
    data: transactionModel.create(transactionData),
  });
};

const transactionController = {
  debitAccount(req, res) {
    const init = txnInit(req, res);

    if (!init.cashier) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'The cashier value you entered is incorrect',
      });
    }

    if (!init.account) {
      return res.status(400).json({
        status: res.statusCode,
        error: `The bank account you wanted to post a ${req.body.type} transaction for is incorrect`,
      });
    }

    const { account } = init;

    const oldBalance = account.balance;
    const newBal = Number(account.balance) - Number(req.body.amount);

    if (newBal < 0) {
      return res.status(400).json({
        status: res.statusCode,
        error: 'This bank account do not have enough fund to complete this transaction',
      });
    }

    account.balance = convertTo2dp(newBal);

    saveAndReturnTxnDetails(req, res, oldBalance, account);
  },

  // creditAccount(req, res) {
  //   const init = txnInit(req, res);

  //   if (!init.cashier) {
  //     return res.status(400).json({
  //       status: res.statusCode,
  //       error: 'The cashier value you entered is incorrect',
  //     });
  //   }

  //   if (!init.account) {
  //     return res.status(400).json({
  //       status: res.statusCode,
  //       error: `The bank account you wanted to post a ${req.body.type} transaction for is incorrect`,
  //     });
  //   }

  //   const { account } = init;
  //   const oldBalance = account.balance;

  //   account.balance = convertTo2dp(Number(account.balance) + Number(req.body.amount));

  //   saveAndReturnTxnDetails(req, res, oldBalance, account);
  // },
};

export default transactionController;
