import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import seedUsersTable from '../../../database/seeders/seed-users';
import seedAccountTable from '../../../database/seeders/seed-account';
import * as allTables from '../../../database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/accounts', () => {
  before('Account-Endpoints-Migration-Up-Test', async () => {
    await allTables.createAllTables();
    await seedUsersTable();
    await seedAccountTable();
  });

  after('Account-Endpoints-Migration-Down-Test', async () => {
    await allTables.dropAllTables();
  });

  describe('GET /accounts/<account-number>', () => {
    let accountNumber; let clientAuthToken;

    before('Get-One-Account-Login-Client', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'client@domain.com',
          password: 'client@domain.com',
        });

      clientAuthToken = res.body.data[0].token;
    });

    const execGetAccountReq = async () => {
      const res = await chai.request(app)
        .get(`/api/v1/accounts/${accountNumber}`)
        .set('x-auth-token', clientAuthToken);

      return res;
    };

    it('should return 404 for an invalid account', async () => {
      accountNumber = '0000000000'; // invalid account number

      const res = await execGetAccountReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 and the account details', async () => {
      accountNumber = '2222222222'; // valid account number in seeded data

      const res = await execGetAccountReq();
      const acctDetails = res.body.data[0];

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
      expect(res.body).to.has.own.property('data');
      expect(res.body.data).to.be.an('array');
      expect(acctDetails.accountNumber).to.equal(accountNumber);
    });
  });
});
