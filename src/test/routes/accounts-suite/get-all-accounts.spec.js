import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import accountModel from '../../../database/models/account';
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

  describe('GET /accounts', () => {
    let staffAuthToken;

    before('Get-All-Accounts-Login-Staff', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'admin@domain.com',
          password: 'admin@domain.com',
        });

      staffAuthToken = res.body.data[0].token;
    });

    const execGetAllAccountReq = async () => {
      const res = await chai.request(app)
        .get('/api/v1/accounts')
        .set('x-auth-token', staffAuthToken);

      return res;
    };

    it('should return status code 200', async () => {
      const res = await execGetAllAccountReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
    });

    it('should return details of all accounts in database', async () => {
      const accounts = await accountModel.findAll();
      const res = await execGetAllAccountReq();

      const resBody = res.body;

      expect(resBody).to.have.own.property('data');
      expect(resBody.data).to.be.an('array');
      expect(resBody.data.length).to.equal(accounts.length);
      expect(resBody.data[0].id).to.equal(accounts[0].id);
      expect(resBody.data[0].accountNumber).to.equal(accounts[0].account_number);
    });
  });
});
