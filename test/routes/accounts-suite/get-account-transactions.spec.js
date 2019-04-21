import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';
import seedUsers from '../../../src/database/seeders/seed-users';
import seedAccount from '../../../src/database/seeders/seed-account';
import seedTransaction from '../../../src/database/seeders/seed-transaction';
import * as allTables from '../../../src/database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/accounts', () => {
  before('Account-Endpoints-Migration-Up-Test', async () => {
    await allTables.tablesUp();
    await seedUsers();
    await seedAccount();
    await seedTransaction();
  });

  after('Account-Endpoints-Migration-Down-Test', async () => {
    await allTables.tablesDown();
  });

  describe('GET /accounts/<account-number>/transactions', () => {
    let acctNumber;

    const execGetTransactionsReq = async () => {
      const res = await chai.request(app)
        .get(`/api/v1/accounts/${acctNumber}/transactions`);

      return res;
    };

    it('should return 400 for an invalid account number', async () => {
      acctNumber = '0000000000'; // invalid account number

      const res = await execGetTransactionsReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 404 when an account has no transaction history', async () => {
      acctNumber = '1111111111'; // no transaction in seeded data

      const res = await execGetTransactionsReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 and an array of transaction history', async () => {
      acctNumber = '2222222222'; // transaction data exist in seeded data

      const res = await execGetTransactionsReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
      expect(res.body).to.has.own.property('data');
      expect(res.body.data).to.be.an('array');

      res.body.data.forEach(txn => expect(txn.accountNumber).to.equal(acctNumber));
    });
  });
});