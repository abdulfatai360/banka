import Model from './model';
import removeProp from '../../utilities/remove-object-prop';

/**
 * Inherits from Model class and contains method for creating a transaction entity
 *
 * @class Transaction
 * @extends {Model}
 */
class Transaction extends Model {
  // eslint-disable-next-line no-useless-constructor
  constructor(tableName) {
    super(tableName);
  }

  /**
   * Creates and returns a transaction entity
   *
   * @param {object} entityObject - Transaction entity object
   * @returns {array} Contains the entity object representation
   * @memberof Transaction
   */
  async create(entityObject) {
    const rows = await Model.prototype.create.call(this, entityObject);

    rows[0] = removeProp('created_on', rows[0]);
    rows[0] = removeProp('old_balance', rows[0]);

    return rows;
  }
}

export default new Transaction('transaction');
