/* eslint-disable no-useless-constructor */
import Model from './model';
import db from '..';

class User extends Model {
  constructor(tableName) {
    super(tableName);
  }

  async findByEmail(email) {
    const { rows } = await db.query(`
      SELECT *
      FROM ${this.table}
      WHERE email = $1;
    `, [email]);

    return rows;
  }
}

export default new User('users');
