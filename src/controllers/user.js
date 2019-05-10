import PasswordHasher from '../utilities/hash-password';
import AuthToken from '../utilities/auth-token';
import ObjectUtils from '../utilities/object-utils';
import HttpResponse from '../utilities/http-response';
import userModel from '../database/models/user';
import accountModel from '../database/models/account';
import transactionModel from '../database/models/transaction';
import UserAuth from '../middlewares/authorization';

/**
 * Returns an object that represents a user entity
 *
 * @param {object} req - HTTP request object
 * @returns {object} Object representing a user entity
 */
const formulatesUserEntity = (req) => {
  const password = PasswordHasher.generateHash(req.body.password);
  const type = req.body.type || 'Client';

  return {
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email.toLowerCase(),
    password,
    type,
  };
};

/**
 * Contains methods for creating, loging in, and getting the accounts associated to a user
 *
 * @class UserController
 */
class UserController {
  /**
   * Creates and returns details of a user to client
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof UserController
   */
  static async createUser(req, res) {
    let isAdmin;
    let userEntity = formulatesUserEntity(req);

    const existingUser = await userModel.findByOne({ email: userEntity.email });
    if (existingUser.length) {
      return HttpResponse.send(res, 409, { error: 'Email already exists' });
    }

    if ((/^Staff$/i).test(userEntity.type)) {
      req.user = UserAuth.getLoggedInUser(req, res);
      if (!req.user.isAdmin) {
        return HttpResponse.send(res, 403, { error: 'Sorry, only an admin can register a staff account' });
      }

      isAdmin = (/^true$/i).test(req.body.isAdmin) || false;
      userEntity = Object.assign(userEntity, { is_admin: isAdmin });
    }

    const rows = await userModel.create(userEntity);
    let user = ObjectUtils.changeKeysToCamelCase(rows[0]);

    if (!user.isAdmin) user = ObjectUtils.removeOneProperty('isAdmin', user);

    user = ObjectUtils.removeOneProperty('password', user);
    const token = AuthToken.generateToken(user);

    const header = { name: 'x-auth-token', value: token };
    return HttpResponse.sendWithHeader(res, header, 201, {
      data: [Object.assign({ token }, user)],
    });
  }

  /**
   * Logins a user into his/her account
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof UserController
   */
  static async loginUser(req, res) {
    const email = req.body.email.toLowerCase();
    const pass = req.body.password;

    const users = await userModel.findByOne({ email });
    if (!users.length) {
      return HttpResponse.send(res, 400, { error: 'The email or password you entered is incorrect' });
    }

    const isPasswordValid = PasswordHasher.verifyPassword(pass, users[0].password);
    if (!isPasswordValid) {
      return HttpResponse.send(res, 400, { error: 'The email or password you entered is incorrect' });
    }

    let user = ObjectUtils.changeKeysToCamelCase(users[0]);
    user = ObjectUtils.removeOneProperty('password', user);
    if (!user.isAdmin) user = ObjectUtils.removeOneProperty('isAdmin', user);

    const token = AuthToken.generateToken(user);
    const header = { name: 'x-auth-token', value: token };
    return HttpResponse.sendWithHeader(res, header, 200, {
      data: [Object.assign({ token }, user)],
    });
  }

  /**
   * Returns list of accounts associated to a user
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns {object}
   * @memberof UserController
   */
  static async getUserAccounts(req, res) {
    const { userEmailAddress } = req.params;

    const users = await userModel.findByOne({ email: userEmailAddress });
    if (!users.length) {
      return HttpResponse.send(res, 404, { error: 'User does not exist' });
    }

    let accounts = await accountModel.findByOne({ owner_id: users[0].id });
    if (!accounts.length) {
      return HttpResponse.send(res, 200, { message: 'No account for this user yet' });
    }

    accounts = accounts.map((acct) => {
      let account = acct;
      ObjectUtils.changeKeysToCamelCase(account);
      account = ObjectUtils.removeManyProperties(['id', 'openingBalance'], account);
      account = Object.assign({ ownerEmail: users[0].email }, account);
      return account;
    });

    return HttpResponse.send(res, 200, { data: accounts });
  }

  static async getMyAccounts(req, res) {
    let accounts = await accountModel.findByOne({ owner_id: req.user.id });
    if (!accounts.length) {
      return HttpResponse.send(res, 200, { message: 'No account(s) yet' });
    }

    accounts = accounts.map(account => ObjectUtils.changeKeysToCamelCase(account));
    return HttpResponse.send(res, 200, { data: accounts });
  }

  static async getMyTransactions(req, res) {
    req.user = UserAuth.getLoggedInUser(req, res);
    let transactions;

    if (/^staff$/i.test(req.user.type) && !req.user.isAdmin) {
      transactions = await transactionModel.findByOne({ cashier_id: req.user.id });
      if (!transactions.length) {
        return HttpResponse.send(res, 200, { message: 'You have not effect any transaction' });
      }
    }

    if (/^client$/i.test(req.user.type)) {
      const accounts = await accountModel.findByOne({ owner_id: req.user.id });
      if (!accounts.length) {
        return HttpResponse.send(res, 200, { message: 'No account(s) to perform transaction on' });
      }

      const userAccountNumbers = accounts.map(account => account.account_number);

      transactions = await transactionModel.findbyMany('account_number', userAccountNumbers);
      if (!transactions.length) {
        return HttpResponse.send(res, 200, { message: 'No transaction(s) has occurred on your account(s)' });
      }
    }

    transactions = transactions.map(transaction => ObjectUtils.changeKeysToCamelCase(transaction));
    return HttpResponse.send(res, 200, { data: transactions });
  }
}

export default UserController;
