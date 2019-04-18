/* eslint-disable no-useless-constructor */
import Model from './model';

class Account extends Model {
  constructor(tableName) {
    super(tableName);
  }
}

export default new Account('account');
