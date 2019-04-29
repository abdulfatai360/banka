import accountModel from '../database/models/account';
import userModel from '../database/models/user';
import transactionModel from '../database/models/transaction';
import HttpResponse from '../utilities/http-response';
import generateAccountNumber from '../utilities/bank-acct-num';
import changeKeysToCamelCase from '../utilities/change-to-camel-case';

/**
 * Returns an object that represents an account entity
 *
 * @param {object} req - HTTP request object
 * @param {object} accountOwner - Object representing the owner of the account
 * @returns {object} Object representing an account entity
 */
const formulateAccountEntity = (req, accountOwner) => ({
  account_number: generateAccountNumber(accountOwner),
  created_on: new Date(),
  owner_id: Number(req.body.ownerId),
  account_type: req.body.accountType,
  account_status: 'draft',
  opening_balance: req.body.openingBalance,
  balance: 0,
});

/**
 * Contains methods for creating, getting, updating, and deleting an account entity
 *
 * @class AccountController
 */
class AccountController {
  /**
   * Creates and returns details of an account to client
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async createAccount(req, res) {
    const users = await userModel.findByOne({ id: Number(req.body.ownerId) });
    if (!users.length) {
      return HttpResponse.send(res, 400, { error: 'The specified account owner is incorrect' });
    }

    const accountOwner = changeKeysToCamelCase(users[0]);
    const accountEntity = formulateAccountEntity(req, accountOwner);
    const accountInfo = await accountModel.create(accountEntity);

    accountInfo[0] = changeKeysToCamelCase(accountInfo[0]);
    return HttpResponse.send(res, 201, { data: accountInfo });
  }

  /**
   * Updates the status of an account and returns the new status value
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async changeStatus(req, res) {
    const { accountNumber } = req.params;
    const newStatus = req.body.accountStatus;

    const accounts = await accountModel.findByAccountNumber(accountNumber);
    if (!accounts.length) return HttpResponse.send(res, 404, { error: 'Account does not exist' });

    if (/^draft$/i.test(accounts[0].account_status)) {
      if (/^dormant$/i.test(newStatus)) return HttpResponse.send(res, 400, { error: 'Draft account can not be set to dormant' });

      return HttpResponse.send(res, 400, { error: 'Draft account can only be activated by making a credit transaction' });
    }

    if (newStatus.toLowerCase() === accounts[0].account_status.toLowerCase()) {
      return HttpResponse.send(res, 400, { error: `Account is already in ${newStatus} state` });
    }

    const info = await accountModel.changeStatus(accountNumber, newStatus);
    info[0] = changeKeysToCamelCase(info[0]);

    return HttpResponse.send(res, 200, { data: info });
  }

  /**
   * Deletes an account and returns a message to client
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async deleteAccount(req, res) {
    const { accountNumber } = req.params;

    const accounts = await accountModel.deleteOne({ account_number: accountNumber });
    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: 'Account does not exist' });
    }

    return HttpResponse.send(res, 200, { message: 'Account successfully deleted' });
  }

  /**
   * Gets and returns a list of all transactions an account has made
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async getAllTransactions(req, res) {
    const { accountNumber } = req.params;

    const accounts = await accountModel.findByAccountNumber(accountNumber);
    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: 'Account does not exist' });
    }

    if (Number(req.user.id) !== Number(accounts[0].owner_id)) {
      return HttpResponse.send(res, 400, { error: 'Account does not belong to this user' });
    }

    const transactions = await transactionModel.findByOne({ account_number: accountNumber });
    if (!transactions.length) {
      return HttpResponse.send(res, 200, { message: 'No transaction history for this account' });
    }

    transactions.forEach(transaction => changeKeysToCamelCase(transaction));
    return HttpResponse.send(res, 200, { data: transactions });
  }

  /**
   * Gets and returns a specific account details
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async getSpecificAccount(req, res) {
    const { accountNumber } = req.params;

    const accounts = await accountModel.findByAccountNumber(accountNumber);
    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: 'Account does not exist' });
    }

    if (Number(req.user.id) !== Number(accounts[0].owner_id)) {
      return HttpResponse.send(res, 400, { error: 'Account does not belong to this user' });
    }

    accounts[0] = changeKeysToCamelCase(accounts[0]);
    return HttpResponse.send(res, 200, { data: accounts });
  }

  /**
   * Filters and returns a list of account based on the value of the account's status
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async filterAccounts(req, res) {
    const { status } = req.query; let accounts;

    if (!status || Object.keys(req.query).length > 1) {
      return HttpResponse.send(res, 400, { error: 'Invalid query' });
    }

    if (status === 'active') {
      accounts = await accountModel.findByOne({ account_status: 'active' });
    }

    if (status === 'dormant') {
      accounts = await accountModel.findByOne({ account_status: 'dormant' });
    }

    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: `No ${status} accounts found` });
    }

    accounts.forEach(account => changeKeysToCamelCase(account));
    return HttpResponse.send(res, 200, { data: accounts });
  }

  /**
   * Gets and returns details of all accounts
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof AccountController
   */
  static async getAllAccounts(req, res) {
    const accounts = await accountModel.findAll();

    if (Object.keys(req.query).length) {
      return AccountController.filterAccounts(req, res);
    }

    accounts.forEach(account => changeKeysToCamelCase(account));
    return HttpResponse.send(res, 200, { data: accounts });
  }
}

export default AccountController;
