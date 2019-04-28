import bcrypt from 'bcryptjs';

/**
 * Contains methods for hashing and verifying a password
 *
 * @class PasswordHasher
 */
class PasswordHasher {
  /**
   * Auto generates a salt and hashes a password
   *
   * @static
   * @param {string} password - Plain password to hash
   * @returns {string} - Hash
   * @memberof PasswordHasher
   */
  static generateHash(password) {
    return bcrypt.hashSync(password, 10);
  }

  /**
   * Verifies a plain password against and hash
   *
   * @static
   * @param {string} password - Plain password to be verified
   * @param {string} hash - Hash to verify the password against
   * @returns {boolean}
   * @memberof PasswordHasher
   */
  static verifyPassword(password, hash) {
    return bcrypt.compareSync(password, hash);
  }
}

export default PasswordHasher;
