import '@babel/polyfill';
import hashPassword from '../utilities/hash-password';
import authToken from '../utilities/auth-token';
import { userModel } from '../models/user';
import removeObjectProp from '../utilities/remove-object-prop';
import HttpResponse from '../utilities/http-response';

const loginErrHandler = (req, res) => (
  HttpResponse.send(res, 400, {
    error: 'Sorry, the email or password you entered is incorrect',
  })
);

const userData = async (req, res) => {
  const password = await hashPassword.generateHash(req.body.password);
  const type = req.body.type || 'client';

  return {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    otherName: req.body.otherName,
    phone: req.body.phone,
    email: req.body.email,
    password,
    type,
  };
};

const userController = {
  async create(req, res) {
    let isAdmin;
    let userEntity = await userData(req, res);

    if ((/^staff$/i).test(userEntity.type)) {
      isAdmin = (/^true$/i).test(req.body.isAdmin) || false;
    }

    userEntity = (isAdmin !== undefined)
      ? Object.assign(userEntity, { isAdmin })
      : userEntity;

    if (userModel.findByEmail(userEntity.email)) {
      return HttpResponse.send(res, 409, { error: 'A user with this email already existed' });
    }

    const userInfo = userModel.create(userEntity);
    const token = authToken.generateToken(userInfo);
    const header = { name: 'x-auth-token', value: token };

    return HttpResponse.sendWithHeader(res, header, 201, {
      data: Object.assign({ token }, userInfo),
    });
  },

  async login(req, res) {
    let signingInUser = userModel.findByEmail(req.body.email);
    if (!signingInUser) return loginErrHandler(req, res);

    const isPasswordValid = await hashPassword
      .verifyPassword(req.body.password, signingInUser.password);
    if (!isPasswordValid) return loginErrHandler(req, res);

    signingInUser = removeObjectProp('password', signingInUser);
    const token = authToken.generateToken(signingInUser);
    const header = { name: 'x-auth-token', value: token };

    return HttpResponse.sendWithHeader(res, header, 200, {
      data: Object.assign({ token }, signingInUser),
    });
  },
};

export default userController;
