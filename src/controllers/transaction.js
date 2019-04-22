import userModel from '../database/models/user';
import accountModel from '../database/models/account';
import transactionModel from '../database/models/transaction';
import HttpResponse from '../utilities/http-response';
import changeKeysToCamelCase from '../utilities/change-to-camel-case';

let errMsg;
const txnErrHandler = (res, status) => HttpResponse.send(res, status, { error: errMsg });

const transactionInit = async (req, res) => {
  const { accountNumber } = req.params;
  const cashierId = Number(req.body.cashierId);
  let account; let cashier;

  try {
    account = await accountModel.findByOne({ account_number: accountNumber });
    cashier = await userModel.findCashierById(cashierId);
  } catch (err) {
    console.log('Transaction-Init-Error:', err);
    errMsg = 'Sorry, something went wrong. Please contact site admin';
    return txnErrHandler(res, 500);
  }

  return { account, cashier };
};

const createNReturnTxn = async (req, res, oldBalance, newBalance) => {
  const { accountNumber } = req.params; const { transactionType } = req.body;
  const txnEntity = {
    created_on: new Date(),
    transaction_type: transactionType,
    account_number: accountNumber,
    cashier_id: Number(req.body.cashierId),
    amount: req.body.amount,
    old_balance: oldBalance,
    new_balance: newBalance,
  };

  let txnInfo; let account;

  try {
    txnInfo = await transactionModel.create(txnEntity);
    txnInfo[0] = changeKeysToCamelCase(txnInfo[0]);

    account = await accountModel.findAndUpdate(
      { account_number: accountNumber },
      { balance: newBalance },
    );
  } catch (err) {
    console.log('Return-Txn-Info- / Update-Account-Balance-Error:', err);
  }

  if (/^draft$/i.test(account[0].account_status) && /^credit$/i.test(transactionType)) {
    await accountModel.changeStatus(accountNumber, 'active');
  }

  return HttpResponse.send(res, 201, { data: txnInfo });
};

const transactionController = {
  async debitAccount(req, res) {
    const init = await transactionInit(req, res);

    if (!init.account.length) {
      errMsg = 'The account you wanted to debit is incorrect';
      return txnErrHandler(res, 400);
    }

    if (!init.cashier.length) {
      errMsg = 'The cashier id you entered is incorrect';
      return txnErrHandler(res, 400);
    }

    const { account } = init;

    if (/^dormant$/i.test(account[0].account_status)) {
      errMsg = 'Transaction can not occur on a dormant account. Reactivate this account to enable it for transaction posting.';
      return txnErrHandler(res, 400);
    }

    if (/^draft$/i.test(account[0].account_status)) {
      errMsg = 'A debit transaction can not occur on a draft account. Activate this account by crediting it with its specified opening balance.';
      return txnErrHandler(res, 400);
    }

    const oldBalance = account[0].balance;
    const newBalance = Number(oldBalance) - Number(req.body.amount);

    if (newBalance < 0) {
      errMsg = 'Insufficient fund to complete this transaction';
      return txnErrHandler(res, 400);
    }

    const resp = await createNReturnTxn(req, res, oldBalance, newBalance);
    return resp;
  },

  async creditAccount(req, res) {
    const init = await transactionInit(req, res);

    if (!init.account.length) {
      errMsg = 'The account you wanted to credit is incorrect';
      return txnErrHandler(res, 400);
    }

    if (!init.cashier.length) {
      errMsg = 'The cashier id you entered is incorrect';
      return txnErrHandler(res, 400);
    }

    const { account } = init;

    if (/^dormant$/i.test(account[0].account_status)) {
      errMsg = 'Transaction can not occur on a dormant account. Reactivate this account to enable it for transaction posting.';
      return txnErrHandler(res, 400);
    }

    if (/^draft$/i.test(account[0].account_status)) {
      if (account[0].opening_balance > Number(req.body.amount)) {
        errMsg = `Sorry, this is a new account. It can only be activated by making a credit transaction equal or more than the opening balance (NGN ${account[0].opening_balance}) you specified when opening the account.`;
        return txnErrHandler(res, 400);
      }
    }

    const oldBalance = account[0].balance;
    const newBalance = Number(oldBalance) + Number(req.body.amount);
    const resp = await createNReturnTxn(req, res, oldBalance, newBalance);
    return resp;
  },

  async getOneTransaction(req, res) {
    const id = Number(req.params.id); let data;

    try {
      const transaction = await transactionModel.findByOne({ id });

      if (!transaction.length) return HttpResponse.send(res, 404, { error: 'The transaction with the specified id is not available.' });

      transaction[0] = changeKeysToCamelCase(transaction[0]);
      data = transaction;
    } catch (err) {
      console.log('Get-One-Transaction-Error: ', err);

      return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please contact the site administrator' });
    }

    return HttpResponse.send(res, 200, { data });
  },
};

export default transactionController;
