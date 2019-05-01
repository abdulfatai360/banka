import Model from './model';
import db from '..';

/**
 * Inherits from Model class and contains method for creating an account entity
 *
 * @class Account
 * @extends {Model}
 */
class Account extends Model {
  // eslint-disable-next-line no-useless-constructor
  constructor(tableName) {
    super(tableName);
  }

  /**
   * Creates and returns an account entity
   *
   * @param {object} entityObject - Account entity object
   * @returns {array} Contains the entity object representation
   * @memberof Account
   */
  async create(entityObject) {
    await Model.prototype.create.call(this, entityObject);

    const text = `
      SELECT 
        ${this.table}.id, 
        ${this.table}.account_number, 
        users.first_name, 
        users.last_name, 
        users.email, 
        ${this.table}.account_type, 
        ${this.table}.opening_balance
      FROM
        account
      JOIN
        users ON ${this.table}.owner_id = users.id
      ORDER BY ${this.table}.id DESC
      LIMIT 1;
    `;

    const { rows } = await db.query(text);
    return rows;
  }

  /**
   * Finds an account by its account number and returns the account details
   *
   * @param {string} accountNumber Account number value
   * @returns {array} Contains the entity object representation
   * @memberof Account
   */
  async findByAccountNumber(accountNumber) {
    const text = `
      SELECT
        ${this.table}.id, 
        ${this.table}.created_on, 
        ${this.table}.account_number, 
        ${this.table}.owner_id, 
        users.email, 
        ${this.table}.account_type, 
        ${this.table}.account_status, 
        ${this.table}.balance 
      FROM
        account
      JOIN
        users 
      ON ${this.table}.owner_id = users.id 
      WHERE account_number = $1;
    `;

    const values = [accountNumber];

    const { rows } = await db.query(text, values);
    return rows;
  }

  /**
   * Finds an account based on its account number value, updates its status, and returns its details
   *
   * @param {string} accountNumber Account number value
   * @param {string} status Value of the new status
   * @returns {array} Contains the entity object representation
   * @memberof Account
   */
  async changeStatus(accountNumber, status) {
    const text = `
      UPDATE ${this.table} 
      SET account_status = $1 
      WHERE account_number = $2 
      RETURNING account_number, account_status;
    `;

    const values = [status, accountNumber];

    const { rows } = await db.query(text, values);
    return rows;
  }
}

export default new Account('account');
