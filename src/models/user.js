/* eslint-disable no-param-reassign */
import '@babel/polyfill';
import Sequence from '../utilities/sequence';
import removeObjectProp from '../utilities/remove-object-prop';

const sequence = new Sequence();

class User {
  constructor() {
    this.database = [];
  }

  create(userData) {
    const newUser = Object.assign(
      { id: sequence.autoIncrement() },
      userData,
    );

    this.database.push(newUser);

    return removeObjectProp('password', newUser);
  }

  // eslint-disable-next-line consistent-return
  getUserFullname(userId) {
    const user = this.database.find(u => u.id === userId);

    if (user) {
      if (user.otherName) {
        return `${user.firstName} ${user.otherName} ${user.lastName}`;
      }

      return `${user.firstName} ${user.lastName}`;
    }
  }

  findByEmail(emailStr) {
    return this.database.find(user => user.email === emailStr);
  }

  findAll() {
    return this.database;
  }

  deleteAll() {
    this.database.splice(0);
    this.findAll();
  }
}

const userModel = new User();
export { userModel, sequence };
