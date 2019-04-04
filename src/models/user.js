/* eslint-disable no-param-reassign */
import '@babel/polyfill';
import Sequence from '../utilities/sequence';

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

    const propToRemove = 'password';
    const returnedUserEntity = Object.keys(newUser)
      .reduce((object, key) => {
        if (key !== propToRemove) object[key] = newUser[key];
        return object;
      }, {});

    return returnedUserEntity;
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

  getAll() {
    return this.database;
  }

  deleteAll() {
    this.database.splice(0);
    this.getAll();
  }
}

const userModel = new User();
export { userModel, sequence };
