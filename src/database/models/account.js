import Model from './model';
import db from '..';

class Account extends Model {
  // eslint-disable-next-line no-useless-constructor
  constructor(tableName) {
    super(tableName);
  }

  async returnAccountInfo() {
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

  async create(data) {
    await Model.prototype.create.call(this, data);
    const rows = await this.returnAccountInfo();
    return rows;
  }

  async findByAccountNumber(accountNumber) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE account_number = $1;
    `;

    const values = [accountNumber];

    const { rows } = await db.query(text, values);
    return rows;
  }

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
