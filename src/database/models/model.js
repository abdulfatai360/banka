import db from '..';

class Model {
  constructor(tableName) {
    this.table = tableName;
  }

  async create(data) {
    const cols = Object.keys(data);
    const vals = Object.values(data);

    let text = `
      INSERT INTO ${this.table}({{columns}})
      VALUES({{values}})
      RETURNING *;
    `;

    const colText = cols.join(', ');
    const valText = vals.map((val, i) => `$${i + 1}`).join(', ');

    text = text.replace('{{columns}}', colText);
    text = text.replace('{{values}}', valText);

    const { rows } = await db.query(text, vals);
    return rows;
  }

  async findAll() {
    const { rows } = await db.query(`
      SELECT *
      FROM ${this.table}
      ORDER BY id ASC;
    `);

    return rows;
  }

  async findByOne(config = {}) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${Object.keys(config).join('')} = $1;
    `;

    const value = Object.values(config);

    const { rows } = await db.query(text, value);

    return rows;
  }

  async findAndUpdate(config = {}, updatedData = {}) {
    const cols = Object.keys(updatedData);
    const vals = Object.values(updatedData);

    const configKey = Object.keys(config).join('');
    const configValue = Object.values(config).join('');

    let text = `
      UPDATE ${this.table} 
      SET {{cols:vals}} 
      WHERE ${configKey} = '${configValue}'
      RETURNING *;
    `;

    const setText = cols.map((col, i) => `${col} = $${i + 1}`);

    text = text.replace('{{cols:vals}}', setText.join(', '));

    const { rows } = await db.query(text, vals);
    return rows;
  }

  async deleteOne(config = {}) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${Object.keys(config).join('')} = $1
      RETURNING *;
    `;

    const value = Object.values(config);
    const { rows } = await db.query(text, value);

    return rows;
  }
}

export default Model;
