import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';
import db from '../../../src/database';
import accountModel from '../../../src/database/models/account';
import seedUsers from '../../../src/database/seeders/seed-users';
import seedAccount from '../../../src/database/seeders/seed-account';
import * as accountTable from '../../../src/database/tables/account-table';
import * as allTables from '../../../src/database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/accounts', () => {
  before('Account-Endpoints-Migration-Up-Test', async () => {
    await allTables.tablesUp();
    await seedUsers();
  });

  after('Account-Endpoints-Migration-Down-Test', async () => {
    await allTables.tablesDown();
  });

  beforeEach('Filter-Account-Create-Account-Table-Test', async () => {
    await db.query(accountTable.createTable);
    await seedAccount();
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
