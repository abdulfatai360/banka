import PasswordHasher from '../utilities/hash-password';
import AuthToken from '../utilities/auth-token';
import removeObjectProperty from '../utilities/remove-object-prop';
import HttpResponse from '../utilities/http-response';
import userModel from '../database/models/user';
import accountModel from '../database/models/account';
import changeKeysToCamelCase from '../utilities/change-to-camel-case';
import UserAuth from '../middlewares/authorization';

/**
 * Forms and returns an object that represents a user entity
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

    const existingUser = await userModel.findByEmail(userEntity.email);
    if (existingUser.length) {
      return HttpResponse.send(res, 409, { error: 'The email you entered is already taken. Please consider a new email' });
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
    let user = changeKeysToCamelCase(rows[0]);

    if (!user.isAdmin) user = removeObjectProperty('isAdmin', user);
    user = removeObjectProperty('password', user);
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

    const users = await userModel.findByEmail(email);
    if (!users.length) {
      return HttpResponse.send(res, 400, { error: 'The email or password you entered is incorrect' });
    }

    const isPasswordValid = PasswordHasher.verifyPassword(pass, users[0].password);
    if (!isPasswordValid) {
      return HttpResponse.send(res, 400, { error: 'The email or password you entered is incorrect' });
    }

    let user = changeKeysToCamelCase(users[0]);
    user = removeObjectProperty('password', user);
    if (!user.isAdmin) user = removeObjectProperty('isAdmin', user);

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
  static async getMyAccounts(req, res) {
    const { userEmailAddress } = req.params;

    const users = await userModel.findByEmail(userEmailAddress);
    if (!users.length) {
      return HttpResponse.send(res, 400, { error: 'The email address you specified is incorrect' });
    }

    let accounts = await accountModel.findByOne({ owner_id: users[0].id });
    if (!accounts.length) {
      return HttpResponse.send(res, 204, { error: 'This user has not opened an account yet' });
    }

    accounts = accounts.map((acct) => {
      let account = acct;
      changeKeysToCamelCase(account);
      account = removeObjectProperty('id', account);
      account = removeObjectProperty('openingBalance', account);
      account = Object.assign({ ownerEmail: users[0].email }, account);
      return account;
    });

    return HttpResponse.send(res, 200, { data: accounts });
  }
}

export default UserController;
