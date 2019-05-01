import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secretKey = process.env.JWT_SECRET;
const options = { expiresIn: '1d' };

/**
 * Contains methods for generating and verifying JsonWebToken
 *
 * @class AuthorizationToken
 */
class AuthorizationToken {
  /**
   * Generates a JsonWebToken for a user entity and returns it as a string
   *
   * @static
   * @param {object} payload - Object literal extracted from the user entity
   * @returns {string} - JsonWebToken
   * @memberof AuthorizationToken
   */
  static generateToken(payload) {
    return jwt.sign(payload, secretKey, options);
  }

  /**
   * Returns the payload decoded if the supplied JsonWebToken is valid
   *
   * @static
   * @param {string} token - JsonWebToken string
   * @returns {object} - Payload decoded representing the user entity
   * @memberof AuthorizationToken
   */
  static verifyToken(token) {
    return jwt.verify(token, secretKey);
  }
}

export default AuthorizationToken;
