import Model from './model';
import db from '..';

class User extends Model {
  // eslint-disable-next-line no-useless-constructor
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

  async findCashierById(id) {
    const text = `
      SELECT * 
      FROM ${this.table} 
      WHERE id = $1 AND is_admin = $2;
    `;

    const values = [id, false];

    const { rows } = await db.query(text, values);
    return rows;
  }
}

export default new User('users');
