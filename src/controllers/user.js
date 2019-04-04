import '@babel/polyfill';
import hashPassword from '../utilities/hash-password';
import authToken from '../utilities/auth-token';
import { userModel } from '../models/user';

const user = {
  async create(req, res) {
    // hash user's input password
    const password = await hashPassword.generateHash(req.body.password);

    // set user account type
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

    // set isAdmin based on account type
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
      .status(201)
      .json({
        status: res.statusCode,
        data: Object.assign({ token }, data),
      });
  },
};

export default user;
