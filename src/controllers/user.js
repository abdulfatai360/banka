import '@babel/polyfill';
import hashPassword from '../utilities/hash-password';
import authToken from '../utilities/auth-token';
import { userModel } from '../models/user';
import removeObjectProp from '../utilities/remove-object-prop';

const loginErrHandler = (req, res) => (
  res.status(400).json({
    status: res.statusCode,
    error: 'Your email or password does not exist in our user database',
  })
);

const user = {
  async create(req, res) {
    // hash user's input password
    const password = await hashPassword.generateHash(req.body.password);

    // set user account type and isAdmin property
    const type = req.body.type || 'client';
    let isAdmin;

    if (type.search(/^staff$/i) !== -1) {
      isAdmin = (/^true$/i).test(req.body.isAdmin) || false;
    }

    let userEntity = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      otherName: req.body.otherName,
      phone: req.body.phone,
      email: req.body.email,
      password,
      type,
    };

    // update userEntity to reflect isAdmin prop
    userEntity = (isAdmin !== undefined)
      ? Object.assign(userEntity, { isAdmin })
      : userEntity;

    // check for duplicate
    if (userModel.findByEmail(userEntity.email)) {
      return res.status(409).json({
        status: res.statusCode,
        error: 'A user with this email address already existed',
      });
    }

    // create user account and save to database
    const data = userModel.create(userEntity);

    // generate user authentication token
    const token = authToken.generateToken(data);

    // add auth-token to response header and include in response body
    return res.header('x-auth-token', token)
      .status(201).json({
        status: res.statusCode,
        data: Object.assign({ token }, data),
      });
  },

  async login(req, res) {
    // authenticate email credential
    let signingInUser = userModel.findByEmail(req.body.email);
    if (!signingInUser) return loginErrHandler(req, res);

    // authenticate password credential
    const isPasswordValid = await hashPassword
      .verifyPassword(req.body.password, signingInUser.password);
    if (!isPasswordValid) return loginErrHandler(req, res);

    // at this point, credentials are authentic
    signingInUser = removeObjectProp('password', signingInUser);
    const token = authToken.generateToken(signingInUser);

    return res.header('x-auth-token', token)
      .status(200)
      .json({
        status: res.statusCode,
        data: Object.assign({ token }, signingInUser),
      });
  },
};

export default user;
