import '@babel/polyfill';
import Sequence from '../utilities/sequence';
import convertTo2dp from '../utilities/convert-to-2dp';
import { userModel } from './user';
import bankAccountNumber from '../utilities/bank-acct-num';

const sequence = new Sequence();

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
    const duplicate = this.findAccountDuplicate(acctNumber);
    acctNumber = duplicate ? bankAccountNumber(acctOwner) : acctNumber;

    const accountEntity = {
      id: sequence.autoIncrement(),
      accountNumber: acctNumber,
      createdOn: new Date(),
      owner: data.owner,
      type: data.type,
      status: 'active',
      openingBalance: convertTo2dp(0),
      balance: convertTo2dp(0),
    };

    this.bankAccounts.push(accountEntity);
    return accountEntity;
  }

  findAccountDuplicate(acctNumber) {
    return this.bankAccounts
      .find(acct => acct.accountNumber === acctNumber);
  }
}

const accountModel = new Account();
export { accountModel, sequence };
