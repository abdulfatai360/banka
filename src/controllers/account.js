import accountModel from '../database/models/account';
import userModel from '../database/models/user';
import transactionModel from '../database/models/transaction';
import HttpResponse from '../utilities/http-response';
import accountNumberGen from '../utilities/bank-acct-num';
import changeKeysToCamelCase from '../utilities/change-to-camel-case';

const accountData = (req, acctOwner) => ({
  account_number: accountNumberGen(acctOwner),
  created_on: new Date(),
  owner_id: Number(req.body.ownerId),
  account_type: req.body.accountType,
  account_status: 'draft',
  opening_balance: req.body.openingBalance,
  balance: 0,
});

const accountController = {
  async createAccount(req, res) {
    let data;

    try {
      const rows = await userModel.findByOne({ id: Number(req.body.ownerId) });

      if (!rows.length) {
        return HttpResponse.send(res, 400, { error: 'The specified account owner id is incorrect' });
      }

      const accountOwner = changeKeysToCamelCase(rows[0]);
      const accountEntity = accountData(req, accountOwner);
      const accountInfo = await accountModel.create(accountEntity);

      accountInfo[0] = changeKeysToCamelCase(accountInfo[0]);
      data = accountInfo;
    } catch (err) {
      console.log('Create-Bank-Account-Error: ', err);
      return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please contact the site administrator' });
    }

    return HttpResponse.send(res, 201, { data });
  },

  async changeStatus(req, res) {
    const { accountNumber } = req.params;
    const newStatus = req.body.accountStatus;
    let data;

    try {
      const rows = await accountModel.changeStatus(accountNumber, newStatus);

      if (!rows.length) {
        return HttpResponse.send(res, 400, { error: 'The account you entered is incorrect' });
      }

      rows[0] = changeKeysToCamelCase(rows[0]);
      data = rows;
    } catch (err) {
      console.log('Change-Account-Status-Error: ', err);

      return HttpResponse.handleError(res, 500, { error: 'Sorry, something went wrong. Please contact the site administrator' });
    }

    return HttpResponse.send(res, 200, { data });
  },

  async deleteAccount(req, res) {
    const { accountNumber } = req.params;

    try {
      const account = await accountModel
        .deleteOne({ account_number: accountNumber });

      if (!account.length) {
        return HttpResponse.send(res, 400, { error: 'The account you wanted to delete is invalid' });
      }
    } catch (err) {
      console.log('Delete-Bank-Account-Error: ', err);

      return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please contact the site administrator' });
    }

    return HttpResponse.send(res, 200, { message: 'Account successfully deleted' });
  },

  async getAllTransactions(req, res) {
    const { accountNumber } = req.params; let data;

    try {
      // to confirm if the account number exist in database
      const accounts = await accountModel.findByAccountNumber(accountNumber);

      if (!accounts.length) return HttpResponse.send(res, 400, { error: 'Sorry, the account number you wanted to view its transaction history is incorrect' });

      // to check if the account number has any transaction record
      const transactions = await transactionModel.findByOne({ account_number: accountNumber });

      if (!transactions.length) return HttpResponse.send(res, 404, { error: 'No transaction has occurred on this account yet' });

      transactions.forEach(txn => changeKeysToCamelCase(txn));

      data = transactions;
    } catch (err) {
      console.log('Get-All-Account-Transaction-Error: ', err);

      return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please contact the site administrator' });
    }

    return HttpResponse.send(res, 200, { data });
  },
};

export default accountController;
