import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import db from '../../../database';
import accountModel from '../../../database/models/account';
import seedUsersTable from '../../../database/seeders/seed-users';
import seedAccountTable from '../../../database/seeders/seed-account';
import * as accountTable from '../../../database/tables/account-table';
import * as allTables from '../../../database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/accounts', () => {
  before('Account-Endpoints-Migration-Up-Test', async () => {
    await allTables.createAllTables();
    await seedUsersTable();
  });

  after('Account-Endpoints-Migration-Down-Test', async () => {
    await allTables.dropAllTables();
  });

  describe('PATCH /accounts/<account-number>', () => {
    let accountNumber; let httpRequestBody; let adminAuthToken;

    before('Change-Account-Status-Login-Admin', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'admin@domain.com',
          password: 'admin@domain.com',
        });

      adminAuthToken = res.body.data[0].token;
    });

    beforeEach('Create-Account-Create-Account-Table-Test', async () => {
      await db.query(accountTable.createTable);
      await seedAccountTable();
    });

    afterEach('Create-Account-Drop-Account-Table-Test', async () => {
      await db.query(accountTable.dropTable);
    });

    const execChangeStatusReq = async () => {
      const res = await chai.request(app)
        .patch(`/api/v1/accounts/${accountNumber}`)
        .set('x-auth-token', adminAuthToken)
        .send(httpRequestBody);

      return res;
    };

    it('should return 404 for invalid account', async () => {
      accountNumber = '0000000000';
      httpRequestBody = { accountStatus: 'active' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.an('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 when an account status is changed', async () => {
      accountNumber = '2222222222'; // value in seeded data
      httpRequestBody = { accountStatus: 'dormant' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
    });

    it('should return the account new status and update it in the database', async () => {
      accountNumber = '2222222222';
      httpRequestBody = { accountStatus: 'dormant' };

      const res = await execChangeStatusReq();
      let account = await accountModel.findByAccountNumber('2222222222');
      [account] = account;

      expect(res.body).to.have.own.property('data');
      expect(res.body.data[0]).to.have.own.property('accountStatus');
      expect(res.body.data[0].accountStatus).to.match(/dormant/i);
      expect(account.account_status).to.match(/dormant/i);
    });
  });
});
