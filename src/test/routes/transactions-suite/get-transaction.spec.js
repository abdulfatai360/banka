import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import transactionModel from '../../../database/models/transaction';
import seedUsersTable from '../../../database/seeders/seed-users';
import seedAccountTable from '../../../database/seeders/seed-account';
import seedTransactionTable from '../../../database/seeders/seed-transaction';
import * as allTables from '../../../database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/transactions', () => {
  before('Transactions-Endpoints-Migration-Up-Test', async () => {
    await allTables.createAllTables();
    await seedUsersTable();
    await seedAccountTable();
    await seedTransactionTable();
  });

  after('Transactions-Endpoints-Migration-Down-Test', async () => {
    await allTables.dropAllTables();
  });

  describe('GET /transactions/<id>', () => {
    let transactionId; let clientAuthToken;

    before('Get-One-Transaction-Login-Client', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'client@domain.com',
          password: 'client@domain.com',
        });

      clientAuthToken = res.body.data[0].token;
    });

    const execGetOneTxnReq = async () => {
      const res = await chai.request(app)
        .get(`/api/v1/transactions/${transactionId}`)
        .set('x-auth-token', clientAuthToken);

      return res;
    };

    it('should return 404 if the transaction detail is not available', async () => {
      transactionId = '5'; // no record for this id in the seeded data

      const res = await execGetOneTxnReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 if transaction detail is available', async () => {
      transactionId = '1'; // record available for this id in seeded data

      const res = await execGetOneTxnReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('data');
      expect(res.body.data).to.be.an('array');
    });

    it('should return the detail of the transaction', async () => {
      transactionId = '1';

      const res = await execGetOneTxnReq();

      const resBody = res.body.data[0];
      const txn = await transactionModel.findByOne({ id: transactionId });

      expect(resBody.id).to.equal(txn[0].id);
      expect(resBody.transactionType).to.equal(txn[0].transaction_type);
      expect(resBody.accountNumber).to.equal(txn[0].account_number);
      expect(resBody.amount).to.equal(txn[0].amount);
      expect(resBody.oldBalance).to.equal(txn[0].old_balance);
      expect(resBody.newBalance).to.equal(txn[0].new_balance);
    });
  });
});
