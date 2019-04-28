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

  beforeEach('Filter-Account-Create-Account-Table-Test', async () => {
    await db.query(accountTable.createTable);
    await seedAccountTable();
  });

  afterEach('Filter-Account-Drop-Account-Table-Test', async () => {
    await db.query(accountTable.dropTable);
  });

  describe('GET /accounts?status=dormant', () => {
    let staffAuthToken;

    before('Get-Dormant-Accounts-Login-Staff', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'admin@domain.com',
          password: 'admin@domain.com',
        });

      staffAuthToken = res.body.data[0].token;
    });

    const execGetDormantAccountReq = async () => {
      const res = await chai.request(app)
        .get('/api/v1/accounts?status=dormant')
        .set('x-auth-token', staffAuthToken);

      return res;
    };

    it('should return 404 if there are no dormant accounts', async () => {
      // remove the dormant account in the seeded data
      await accountModel.deleteOne({ account_number: '3333333333' });

      const res = await execGetDormantAccountReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.a('number');
    });

    it('should return status code 200', async () => {
      const res = await execGetDormantAccountReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
    });

    it('should return only dormant accounts in the database', async () => {
      const res = await execGetDormantAccountReq();
      const resBody = res.body;

      expect(resBody).to.have.own.property('data');
      expect(resBody.data).to.be.an('array');
      resBody.data.forEach((account) => {
        const { accountStatus } = account;
        expect(accountStatus).to.match(/^dormant$/i);
      });
    });
  });
});
