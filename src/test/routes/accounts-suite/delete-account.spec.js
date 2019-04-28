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

  describe('DELETE /accounts/<account-number>', () => {
    let accountNumber; let staffAuthToken;

    before('Change-Account-Status-Login-Staff', async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'admin@domain.com',
          password: 'admin@domain.com',
        });

      staffAuthToken = res.body.data[0].token;
    });

    const execDeleteReq = async () => {
      const res = await chai.request(app)
        .delete(`/api/v1/accounts/${accountNumber}`)
        .set('x-auth-token', staffAuthToken);

      return res;
    };

    beforeEach('Delete-Account-Create-Account-Table-Test', async () => {
      await db.query(accountTable.createTable);
      await seedAccountTable();
    });

    afterEach('Create-Account-Drop-Account-Table-Test', async () => {
      await db.query(accountTable.dropTable);
    });

    it('should return 404 for invalid account', async () => {
      accountNumber = '0000000000';

      const res = await execDeleteReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 when an account is deleted', async () => {
      accountNumber = '1111111111';

      const res = await execDeleteReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
    });

    it('should delete the account in the database', async () => {
      accountNumber = '1111111111';

      await execDeleteReq();
      const account = await accountModel.findByOne({ id: 1 });

      expect(account[0]).to.equal(undefined);
    });
  });
});
