import hashPassword from '../utilities/hash-password';
import authToken from '../utilities/auth-token';
import removeObjectProp from '../utilities/remove-object-prop';
import HttpResponse from '../utilities/http-response';
import userModel from '../database/models/user';
import accountModel from '../database/models/account';
import changeKeysToCamelCase from '../utilities/change-to-camel-case';

const loginErrHandler = res => (
  HttpResponse.send(res, 400, {
    error: 'Sorry, the email or password you entered is incorrect',
  })
);

const signUpErrHandler = (res, error) => {
  if (error.code === '23505') {
    return HttpResponse.send(res, 409, { error: 'The email you entered is already taken. Please consider a new email' });
  }

  console.log('Signup-Controller-Error: ', error.message);
  return HttpResponse.send(res, 500, { error: 'Sorry,something went wrong. We can not complete your request now. Please contact site administrator' });
};

const userData = (req) => {
  const password = hashPassword.generateHash(req.body.password);
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

const userController = {
  async createUser(req, res) {
    let isAdmin;
    let userEntity = userData(req);
    let user;

    if ((/^Staff$/i).test(userEntity.type)) {
      isAdmin = (/^true$/i).test(req.body.isAdmin) || false;
      userEntity = Object.assign(userEntity, { is_admin: isAdmin });
    }

    try {
      const rows = await userModel.create(userEntity);
      [user] = rows;

      if (!user.is_admin) user = removeObjectProp('is_admin', user);
      user = removeObjectProp('password', user);
    } catch (error) {
      return signUpErrHandler(res, error);
    }

    const token = authToken.generateToken(user);
    const header = { name: 'x-auth-token', value: token };

    return HttpResponse.sendWithHeader(res, header, 201, {
      data: [changeKeysToCamelCase(Object.assign({ token }, user))],
    });
  },

  async loginUser(req, res) {
    const emailCred = req.body.email.toLowerCase();
    const passCred = req.body.password;

    const rows = await userModel.findByEmail(emailCred);

    if (!rows.length) return loginErrHandler(res);

    const isPasswordValid = hashPassword
      .verifyPassword(passCred, rows[0].password);

    if (!isPasswordValid) return loginErrHandler(res);

    let user = removeObjectProp('password', rows[0]);
    if (!user.is_admin) user = removeObjectProp('is_admin', user);

    const token = authToken.generateToken(user);
    const header = { name: 'x-auth-token', value: token };

    return HttpResponse.sendWithHeader(res, header, 200, {
      data: [changeKeysToCamelCase(Object.assign({ token }, user))],
    });
  },

  async getMyAccounts(req, res) {
    const { userEmailAddress } = req.params;
    const user = await userModel.findByEmail(userEmailAddress);

    if (!user.length) {
      return HttpResponse.send(res, 400, { error: 'The email address you specified is incorrect' });
    }

    let accounts = await accountModel.findByOne({ owner_id: user[0].id });

    if (!accounts.length) {
      return HttpResponse.send(res, 404, { error: 'This user has not opened an account yet' });
    }

    accounts = accounts.map((acct) => {
      let account = acct;
      changeKeysToCamelCase(account);
      account = removeObjectProp('id', account);
      account = removeObjectProp('openingBalance', account);
      account = Object.assign({ ownerEmail: user[0].email }, account);
      return account;
    });

    return HttpResponse.send(res, 200, { data: accounts });
  },
};

export default userController;
