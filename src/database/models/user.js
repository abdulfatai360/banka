import Model from './model';

/**
 * Inherits from Model class and contains method for creating a user entity
 *
 * @class User
 * @extends {Model}
 */
class User extends Model {
  // eslint-disable-next-line no-useless-constructor
  constructor(tableName) {
    super(tableName);
  }
}

export default new User('users');
