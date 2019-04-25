import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';
import db from '../../../src/database';
import accountModel from '../../../src/database/models/account';
import seedUsers from '../../../src/database/seeders/seed-users';
import seedAccount from '../../../src/database/seeders/seed-account';
import * as txnTable from '../../../src/database/tables/transaction-table';
import * as accountTable from '../../../src/database/tables/account-table';
import * as allTables from '../../../src/database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/transactions', () => {
  before('Transactions-Endpoints-Migration-Up-Test', async () => {
    await allTables.tablesUp();
    await seedUsers();
  });

  after('Transactions-Endpoints-Migration-Down-Test', async () => {
    await allTables.tablesDown();
  });

  describe('POST /transactions/<account-number>/debit', () => {
    let transactionInfo; let accountNumber; let cashierAuthToken;

    before('Debit-Account-Login-Cashier', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'cashier@domain.com',
          password: 'cashier@domain.com',
        });

      cashierAuthToken = res.body.data[0].token;
    });

    const execDebitTxnReq = async () => {
      const res = await chai.request(app)
        .post(`/api/v1/transactions/${accountNumber}/debit`)
        .set('x-auth-token', cashierAuthToken)
        .send(transactionInfo);

      return res;
    };

    beforeEach('Create-Debit-Transaction-Seed-Account/Txn-Test', async () => {
      await db.query(accountTable.createTable);
      await db.query(txnTable.createTable);
      await seedAccount();
    });

    afterEach('Create-Debit-Transaction-Drop-Account/Txn-Test', async () => {
      await db.query(accountTable.dropTable);
      await db.query(txnTable.dropTable);
    });

    it('should return 400 if account number is invalid', async () => {
      accountNumber = '0000000000';
      transactionInfo = {
        amount: '1000.56',
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 400 if cashier is invalid', async () => {
      accountNumber = '2222222222'; // active in the seeded account table
      transactionInfo = {
        amount: '1000.56',
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 400 if the account is dormant', async () => {
      accountNumber = '3333333333'; // dormant in the seeded account data
      transactionInfo = {
        amount: '1000.56',
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 400 if the account is draft', async () => {
      accountNumber = '1111111111'; // draft in the seeded account data
      transactionInfo = {
        amount: '1000.56',
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 400 if account balance is less than the debit amount', async () => {
      accountNumber = '2222222222';
      transactionInfo = {
        amount: '600.00', // 500.00 is the balance in the seeded data
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 201 if an account is debited', async () => {
      accountNumber = '2222222222';
      transactionInfo = {
        amount: '400.00', // 500.00 is the balance in the seeded data
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(201);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('data');
      expect(res.body.data).to.be.an('array');
    });

    it('should return the transaction info in response body', async () => {
      accountNumber = '2222222222';
      transactionInfo = {
        amount: '400.00', // 500.00 is the balance in the seeded data
        transactionType: 'debit',
      };

      const res = await execDebitTxnReq();
      const resBody = res.body.data[0];

      expect(resBody.transactionType).to.match(/debit/i);
      expect(resBody.accountNumber).to.equal('2222222222');
      expect(resBody.amount).to.equal('400.00');
      expect(resBody.cashierId).to.equal(2);
      expect(Number(resBody.newBalance)).to.be.below(101);
    });

    it('should update the balance of the account in the database', async () => {
      accountNumber = '2222222222';
      transactionInfo = {
        amount: '400.00', // 500.00 is the balance in the seeded data
        transactionType: 'debit',
      };

      await execDebitTxnReq();

      const account = await accountModel.findByAccountNumber(accountNumber);
      expect(Number(account[0].balance)).to.be.below(101);
    });
  });
});
