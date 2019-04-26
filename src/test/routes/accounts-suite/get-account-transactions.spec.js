import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import seedUsersTable from '../../../database/seeders/seed-users';
import seedAccountTable from '../../../database/seeders/seed-account';
import seedTransactionTable from '../../../database/seeders/seed-transaction';
import * as allTables from '../../../database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/accounts', () => {
  before('Account-Endpoints-Migration-Up-Test', async () => {
    await allTables.createAllTables();
    await seedUsersTable();
    await seedAccountTable();
    await seedTransactionTable();
  });

  after('Account-Endpoints-Migration-Down-Test', async () => {
    await allTables.dropAllTables();
  });

  describe('GET /accounts/<account-number>/transactions', () => {
    let accountNumber; let clientAuthToken;

    before('Create-Account-Transaction-Login-Client', async () => {
      const response = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'client@domain.com',
          password: 'client@domain.com',
        });

      clientAuthToken = response.body.data[0].token;
    });

    const execGetTransactionsReq = async () => {
      const res = await chai.request(app)
        .get(`/api/v1/accounts/${accountNumber}/transactions`)
        .set('x-auth-token', clientAuthToken);

      return res;
    };

    it('should return 400 for an invalid account number', async () => {
      accountNumber = '0000000000'; // invalid account number

      const res = await execGetTransactionsReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 204 when an account has no transaction history', async () => {
      accountNumber = '1111111111'; // no transaction in seeded data

      const res = await execGetTransactionsReq();

      expect(res).to.have.status(204);
      expect(res.status).to.be.a('number');
    });

    it('should return 200 and an array of transaction history', async () => {
      accountNumber = '2222222222'; // transaction data exist in seeded data

      const res = await execGetTransactionsReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
      expect(res.body).to.has.own.property('data');
      expect(res.body.data).to.be.an('array');

      res.body.data.forEach(txn => expect(txn.accountNumber).to.equal(accountNumber));
    });
  });
});
