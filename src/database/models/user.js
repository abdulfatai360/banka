import Model from './model';
import db from '..';

/**
 * Inherits from Model class and contains method for creating a user entity
 *
 * @class User
 * @extends {Model}
 */
class User extends Model {
  // eslint-disable-next-line no-useless-constructor
  constructor(tableName) {
    super(tableName);
  }

  /**
   * Finds a user by email and returns the user details
   *
   * @param {string} emailValue User email address
   * @returns {array} Contains a single object represening the user
   * @memberof User
   */
  async findByEmail(emailValue) {
    const { rows } = await db.query(`
      SELECT *
      FROM ${this.table}
      WHERE email = $1;
    `, [emailValue]);

    return rows;
  }

  /**
   * Finds a cashier user by id and returns the cashier details
   *
   * @param {number} id Id of the cashier
   * @returns {array} Contains a single object represening the user
   * @memberof User
   */
  async findCashierById(idValue) {
    const text = `
      SELECT * 
      FROM ${this.table} 
      WHERE id = $1 AND is_admin = $2;
    `;

    const values = [idValue, false];

    const { rows } = await db.query(text, values);
    return rows;
  }
}

export default new User('users');
