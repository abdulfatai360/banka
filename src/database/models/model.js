import db from '..';

/**
 * Contains methods for performing Create, Read, Update, and Delete operations on database
 *
 * @class Model
 */
class Model {
  constructor(tableName) {
    this.table = tableName;
  }

  /**
   * Stores and returns an entity details into the database
   *
   * @param {object} entityObject - Details of the entity
   * @returns {array} Contains the entity object representation
   * @memberof Model
   */
  async create(entityObject) {
    const cols = Object.keys(entityObject);
    const vals = Object.values(entityObject);

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

  /**
   * Gets and returns all data from an entity table
   *
   * @returns {array} Contains list of object representing the entity
   * @memberof Model
   */
  async findAll() {
    const { rows } = await db.query(`
      SELECT *
      FROM ${this.table}
      ORDER BY id ASC;
    `);

    return rows;
  }

  /**
   * Gets and returns a single data from a table depending on the search parameter
   *
   * @param {object} paramConfigObject Name and value of the parameter to use to search
   * @returns {array} List of objects
   * @memberof Model
   */
  async findByOne(paramConfigObject) {
    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${Object.keys(paramConfigObject).join('')} = $1;
    `;

    const value = Object.values(paramConfigObject);

    const { rows } = await db.query(text, value);

    return rows;
  }

  async findbyMany(key = '', values = []) {
    const valText = values.map((value, i) => `$${i + 1}`);

    const text = `
      SELECT *
      FROM ${this.table}
      WHERE ${key} IN (${valText.join(', ')});
    `;

    const { rows } = await db.query(text, values);
    return rows;
  }

  /**
   * Finds, update, and returns an entity details based on the search value
   *
   * @param {object} paramConfigObject Name and value of the parameter to use to search
   * @param {object} updatedEntityData New entity details to use for update
   * @returns {array} Contains updated entity object
   * @memberof Model
   */
  async findAndUpdate(paramConfigObject, updatedEntityData) {
    const cols = Object.keys(updatedEntityData);
    const vals = Object.values(updatedEntityData);

    const paramConfigObjectKey = Object.keys(paramConfigObject).join('');
    const paramConfigObjectValue = Object.values(paramConfigObject).join('');

    let text = `
      UPDATE ${this.table} 
      SET {{cols:vals}} 
      WHERE ${paramConfigObjectKey} = '${paramConfigObjectValue}'
      RETURNING *;
    `;

    const setText = cols.map((col, i) => `${col} = $${i + 1}`);

    text = text.replace('{{cols:vals}}', setText.join(', '));

    const { rows } = await db.query(text, vals);
    return rows;
  }

  /**
   * Deletes and returns an entity object
   *
   * @param {object} paramConfigObject Name and value of the parameter to use to search
   * @returns {array} Contains deleted entity object
   * @memberof Model
   */
  async deleteOne(paramConfigObject) {
    const text = `
      DELETE FROM ${this.table}
      WHERE ${Object.keys(paramConfigObject).join('')} = $1
      RETURNING *;
    `;

    const value = Object.values(paramConfigObject);
    const { rows } = await db.query(text, value);

    return rows;
  }
}

export default Model;
