import Sequence from '../utilities/sequence';

const transactionSerial = new Sequence();

class Transaction {
  constructor() {
    this.transactionList = [];
  }

  create(data) {
    const transactionEntity = {
      id: transactionSerial.autoIncrement(),
      createdOn: new Date(),
      type: data.type,
      accountNumber: data.accountNumber,
      cashier: data.cashier,
      amount: data.amount,
      oldBalance: data.oldBalance,
      newBalance: data.newBalance,
    };

    this.transactionList.push(transactionEntity);

    return {
      transactionId: transactionEntity.id,
      accountNumber: transactionEntity.accountNumber,
      amount: transactionEntity.amount,
      cashier: transactionEntity.cashier,
      transactionType: transactionEntity.type,
      accountBalance: transactionEntity.newBalance,
    };
  }
}

const transactionModel = new Transaction();
export { transactionSerial, transactionModel };
