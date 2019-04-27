import accountModel from '../database/models/account';
import transactionModel from '../database/models/transaction';
import HttpResponse from '../utilities/http-response';
import changeKeysToCamelCase from '../utilities/change-to-camel-case';

const createTransaction = async (req, res, oldBalance, newBalance) => {
  const { accountNumber } = req.params;
  const { transactionType } = req.body;
  const transactionEntity = {
    created_on: new Date(),
    transaction_type: transactionType,
    account_number: accountNumber,
    cashier_id: Number(req.body.cashierId),
    amount: req.body.amount,
    old_balance: oldBalance,
    new_balance: newBalance,
  };


  const transactionInfo = await transactionModel.create(transactionEntity);
  transactionInfo[0] = changeKeysToCamelCase(transactionInfo[0]);

  const accounts = await accountModel.findAndUpdate(
    { account_number: accountNumber },
    { balance: newBalance },
  );

  if (/^draft$/i.test(accounts[0].account_status) && /^credit$/i.test(transactionType)) {
    await accountModel.changeStatus(accountNumber, 'active');
  }

  return HttpResponse.send(res, 201, { data: transactionInfo });
};

class TransactionController {
  static async debitAccount(req, res) {
    const { accountNumber } = req.params;

    const accounts = await accountModel.findByOne({ account_number: accountNumber });
    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: 'Account does not exist' });
    }

    const oldBalance = accounts[0].balance;
    const newBalance = Number(oldBalance) - Number(req.body.amount);

    if (/^dormant$/i.test(accounts[0].account_status)) {
      return HttpResponse.send(res, 400, { error: 'Your account is dormant. Please reactivate it' });
    }

    if (/^draft$/i.test(accounts[0].account_status)) {
      return HttpResponse.send(res, 400, { error: 'Insufficient fund' });
    }

    if (newBalance < 0) return HttpResponse.send(res, 400, { error: 'Insufficient fund' });

    const transactionInfo = await createTransaction(req, res, oldBalance, newBalance);
    return transactionInfo;
  }

  static async creditAccount(req, res) {
    const { accountNumber } = req.params;

    const accounts = await accountModel.findByOne({ account_number: accountNumber });
    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: 'Account does not exist' });
    }

    if (/^dormant$/i.test(accounts[0].account_status)) {
      return HttpResponse.send(res, 400, { error: 'Your account is dormant. Please reactivate it' });
    }

    if (/^draft$/i.test(accounts[0].account_status)) {
      if (accounts[0].opening_balance > Number(req.body.amount)) {
        return HttpResponse.send(res, 400, {
          error: 'Please credit an amount equal to or greater than your opening balance',
        });
      }
    }

    const oldBalance = accounts[0].balance;
    const newBalance = Number(oldBalance) + Number(req.body.amount);
    const transactionInfo = await createTransaction(req, res, oldBalance, newBalance);
    return transactionInfo;
  }

  static async getOneTransaction(req, res) {
    const id = Number(req.params.id);

    const transactions = await transactionModel.findByOne({ id });
    if (!transactions.length) {
      return HttpResponse.send(res, 404, { error: 'Transaction does not exist' });
    }

    transactions[0] = changeKeysToCamelCase(transactions[0]);
    return HttpResponse.send(res, 200, { data: transactions });
  }
}

export default TransactionController;
