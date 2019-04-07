import '@babel/polyfill';
import Sequence from '../utilities/sequence';
import convertTo2dp from '../utilities/convert-to-2dp';
import { userModel } from './user';
import bankAccountNumber from '../utilities/bank-acct-num';

const accountSerial = new Sequence();

class Account {
  constructor() {
    this.bankAccounts = [];
  }

  create(data) {
    // find account owner from user database
    const acctOwner = userModel.findById(Number(data.owner));

    // generate account number, find duplicate, and ...
    // generate another if duplicate is found
    let acctNumber = bankAccountNumber(acctOwner);
    const duplicate = this.findByAccountNumber(acctNumber);
    acctNumber = duplicate ? bankAccountNumber(acctOwner) : acctNumber;

    const accountEntity = {
      id: accountSerial.autoIncrement(),
      accountNumber: acctNumber,
      createdOn: new Date(),
      owner: data.owner,
      type: data.type,
      status: 'draft',
      openingBalance: convertTo2dp(0),
      balance: convertTo2dp(0),
    };

    this.bankAccounts.push(accountEntity);
    return accountEntity;
  }

  findByAccountNumber(acctNumber) {
    return this.bankAccounts
      .find(account => account.accountNumber === acctNumber);
  }

  findById(id) {
    return this.bankAccounts.find(account => account.id === id);
  }

  findAll() {
    return this.bankAccounts;
  }

  deleteOne(paramObj = {}) {
    const key = Object.keys(paramObj)[0];

    const accountIndex = this.bankAccounts
      .findIndex(account => account[key] === paramObj[key]);

    this.bankAccounts.splice(accountIndex, 1);
  }

  deleteAll() {
    this.bankAccounts.splice(0);
  }
}

const accountModel = new Account();
export { accountModel, accountSerial };
