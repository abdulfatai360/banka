/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import seedUserDb from './auth.spec';
import seedAccountDb from './accounts.spec';
import { accountModel, accountSerial } from '../../src/models/account';
import { userModel, userSerial } from '../../src/models/user';

const { expect } = chai;
chai.use(chaiHttp);

describe('/transactions', () => {
  before('Populate user database', async () => {
    await seedUserDb();
  });

  after('Clears user database', () => {
    userModel.deleteAll(); userSerial.reset();
  });

  describe('POST /transactions/<account-number>/debit', () => {
    let transactionInfo; let accountNumber;

    const execDebitTxnReq = async () => {
      const res = await chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .send(transactionInfo);

      return res;
    };

    beforeEach('Populate account database', () => {
      seedAccountDb();
    });

    afterEach('Clears account database', () => {
      accountModel.deleteAll();
      accountSerial.reset();
    });

    it('should return 400 if account number is invalid', async () => {
      accountNumber = '0000000000';
      transactionInfo = {
        amount: '1000.56',
        type: 'debit',
        cashier: '3',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res).to.have.own.property('error');
    });

    it('should return 400 if cashier is invalid', async () => {
      accountNumber = accountModel.findById(1).accountNumber;
      transactionInfo = {
        amount: '1000.56',
        type: 'debit',
        cashier: '1',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res).to.have.own.property('error');
    });

    it('should return 400 if account balance is less than the debit amount', async () => {
      accountNumber = accountModel.findById(1).accountNumber;
      transactionInfo = {
        amount: '1000.56',
        type: 'debit',
        cashier: '3',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res).to.have.own.property('error');
    });

    it('should return 201 if an account is debited', async () => {
      const account = accountModel.findById(1);

      accountNumber = account.accountNumber;
      transactionInfo = {
        amount: '50.56',
        type: 'debit',
        cashier: '3',
      };

      account.balance = 500.00;

      const res = await execDebitTxnReq();

      expect(res).to.have.status(201);
      expect(res.body).to.have.own.property('data');
    });

    it('should update the balance of the account in the account database', async () => {
      const account = accountModel.findById(1);

      accountNumber = account.accountNumber;
      transactionInfo = {
        amount: '50.00',
        type: 'debit',
        cashier: '3',
      };

      account.balance = 500.00;

      await execDebitTxnReq();

      expect(account.balance).to.be.below(460);
    });
  });

  describe('POST /transactions/<account-number>/credit', () => {
    let transactionInfo; let accountNumber;

    const execCreditTxnReq = async () => {
      const res = await chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/credit`)
        .send(transactionInfo);

      return res;
    };

    beforeEach('Populate account database', () => {
      seedAccountDb();
    });

    afterEach('Clears account database', () => {
      accountModel.deleteAll();
      accountSerial.reset();
    });

    it('should return 400 if account number is invalid', async () => {
      accountNumber = '0000000000';
      transactionInfo = {
        amount: '1000.56',
        type: 'credit',
        cashier: '3',
      };

      const res = await execCreditTxnReq();

      expect(res).to.have.status(400);
      expect(res).to.have.own.property('error');
    });

    it('should return 400 if cashier is invalid', async () => {
      accountNumber = accountModel.findById(1).accountNumber;
      transactionInfo = {
        amount: '1000.56',
        type: 'credit',
        cashier: '1',
      };

      const res = await execCreditTxnReq();

      expect(res).to.have.status(400);
      expect(res).to.have.own.property('error');
    });

    it('should return 201 if an account is credited', async () => {
      const account = accountModel.findById(1);

      accountNumber = account.accountNumber;
      transactionInfo = {
        amount: '1000.56',
        type: 'credit',
        cashier: '3',
      };

      const res = await execCreditTxnReq();

      expect(res).to.have.status(201);
      expect(res.body).to.have.own.property('data');
    });

    it('should update the balance of the account in the account database', async () => {
      const account = accountModel.findById(1);

      accountNumber = account.accountNumber;
      transactionInfo = {
        amount: '1000.56',
        type: 'debit',
        cashier: '3',
      };

      await execCreditTxnReq();

      expect(account.balance).to.be.above(1000);
    });
  });
});
