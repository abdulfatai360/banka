import Sequence from '../utilities/sequence';
import removeObjectProp from '../utilities/remove-object-prop';

const userSerial = new Sequence();

class User {
  constructor() {
    this.database = [];
  }

  create(userData) {
    const userEntity = Object.assign(
      { id: userSerial.autoIncrement() },
      userData,
    );

    this.database.push(userEntity);

    return removeObjectProp('password', userEntity);
  }

  getFullName(id) {
    const user = this.findById(id);
    return `${user.firstName} ${user.lastName}`;
  }

  findById(id) {
    return this.database.find(user => user.id === id);
  }

  findByEmail(emailStr) {
    return this.database.find(user => user.email === emailStr);
  }

  findCashierById(id) {
    const cashier = this.database.find(user => user.id === id && user.isAdmin === false);

    return cashier;
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
export { userModel, userSerial };
