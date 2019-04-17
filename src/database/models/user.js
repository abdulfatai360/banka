/* eslint-disable no-useless-constructor */
import Model from './model';

class User extends Model {
  constructor(tableName) {
    super(tableName);
  }
}

export default new User('users');
