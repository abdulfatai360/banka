import Model from './model';

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
}

export default new Transaction('transaction');
