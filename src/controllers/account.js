/* eslint-disable camelcase */
/* eslint-disable consistent-return */
import accountModel from '../database/models/account';
import userModel from '../database/models/user';
import HttpResponse from '../utilities/http-response';
import accountNumberGen from '../utilities/bank-acct-num';

const accountData = (req, acctOwner) => ({
  account_number: accountNumberGen(acctOwner),
  created_on: new Date(),
  owner_id: Number(req.body.ownerId),
  account_type: req.body.accountType,
  account_status: 'draft',
  opening_balance: req.body.openingBalance,
  balance: 0,
});

const returnAccountInfo = (acctOwner, acctInfo) => {
  const {
    id, account_number, account_type, opening_balance,
  } = acctInfo[0];
  const { first_name, last_name, email } = acctOwner;

  return {
    id,
    accountNumber: account_number,
    firstName: first_name,
    lastName: last_name,
    email,
    accountType: account_type,
    openingBalance: opening_balance,
  };
};

const accountController = {
  async createAccount(req, res) {
    let data;

    try {
      const { rowCount, rows } = await userModel
        .findById(Number(req.body.ownerId));
      const [accountOwner] = rows;

      if (!rowCount) {
        return HttpResponse.send(res, 400, {
          error: 'The specified account owner id is incorrect',
        });
      }

      const accountInfo = await accountModel
        .create(accountData(req, accountOwner));

      data = returnAccountInfo(accountOwner, accountInfo);
      console.log(data);
    } catch (err) {
      console.log('Error from creating account: ', err);

      return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please contact the site administrator' });
    }

    return HttpResponse.send(res, 201, { data });
  },

  changeStatus(req, res) {
    const { accountNumber } = req.params;
    const newStatus = req.body.status;
    const account = accountModel.findByAccountNumber(accountNumber);

    if (!account) {
      return HttpResponse.send(res, 400, { error: 'The account you entered is incorrect' });
    }

    account.status = newStatus;
    return HttpResponse.send(res, 200, {
      data: { accountNumber, status: account.status },
    });
  },

  delete(req, res) {
    const { accountNumber } = req.params;
    const account = accountModel.findByAccountNumber(accountNumber);

    if (!account) {
      return HttpResponse.send(res, 400, {
        error: 'The account you wanted to delete is invalid',
      });
    }

    accountModel.deleteOne({ accountNumber });
    return HttpResponse.send(res, 200, { message: 'Account successfully deleted' });
  },
};

export default accountController;
