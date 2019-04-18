/* eslint-disable no-restricted-syntax */
import hashPassword from '../utilities/hash-password';
import authToken from '../utilities/auth-token';
import removeObjectProp from '../utilities/remove-object-prop';
import HttpResponse from '../utilities/http-response';
import userModel from '../database/models/user';

const loginErrHandler = res => (
  HttpResponse.send(res, 400, {
    error: 'Sorry, the email or password you entered is incorrect',
  })
);

const signUpErrHandler = (res, error) => {
  if (error.code === '23505') {
    return HttpResponse.send(res, 409, { error: 'The email you entered is already taken. Please consider a new email' });
  }

  console.log('Error from signing up: ', error.message);
  return HttpResponse.send(res, 500, { error: 'Sorry,something went wrong. We can not complete your request now. Please contact site administrator' });
};

const userData = async (req) => {
  const password = await hashPassword.generateHash(req.body.password);
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
    let userEntity = await userData(req);
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
      data: Object.assign({ token }, user),
    });
  },

  async loginUser(req, res) {
    const emailCred = req.body.email.toLowerCase();
    const passCred = req.body.password;

    const { rowCount, rows } = await userModel.findByEmail(emailCred);

    if (!rowCount) return loginErrHandler(res);

    const isPasswordValid = await hashPassword
      .verifyPassword(passCred, rows[0].password);

    if (!isPasswordValid) return loginErrHandler(res);

    let user = removeObjectProp('password', rows[0]);
    if (!user.is_admin) user = removeObjectProp('is_admin', user);

    const token = authToken.generateToken(user);
    const header = { name: 'x-auth-token', value: token };

    return HttpResponse.sendWithHeader(res, header, 200, {
      data: Object.assign({ token }, user),
    });
  },
};

export default userController;
