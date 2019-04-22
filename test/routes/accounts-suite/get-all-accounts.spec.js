import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';
import accountModel from '../../../src/database/models/account';
import seedUsers from '../../../src/database/seeders/seed-users';
import seedAccount from '../../../src/database/seeders/seed-account';
import * as allTables from '../../../src/database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/accounts', () => {
  before('Account-Endpoints-Migration-Up-Test', async () => {
    await allTables.tablesUp();
    await seedUsers();
    await seedAccount();
  });

  after('Account-Endpoints-Migration-Down-Test', async () => {
    await allTables.tablesDown();
  });

  describe('GET /accounts', () => {
    const execGetAllAccountReq = async () => {
      const res = await chai.request(app)
        .get('/api/v1/accounts');

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
