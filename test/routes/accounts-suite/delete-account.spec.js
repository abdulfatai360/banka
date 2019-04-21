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

  describe('DELETE /accounts/<account-number>', () => {
    let acctNumber;

    const execDeleteReq = async () => {
      const res = await chai.request(app)
        .delete(`/api/v1/accounts/${acctNumber}`);

      return res;
    };

    beforeEach('Delete-Account-Create-Account-Table-Test', async () => {
      await db.query(accountTable.createTable);
      await seedAccount();
    });

    afterEach('Create-Account-Drop-Account-Table-Test', async () => {
      await db.query(accountTable.dropTable);
    });

    it('should return 400 for an invalid account number', async () => {
      acctNumber = '0000000000';

      const res = await execDeleteReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 when an account is deleted', async () => {
      acctNumber = '1111111111';

      const res = await execDeleteReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('message');
      expect(res.body.message).to.be.a('string');
    });

    it('should delete the account in the database', async () => {
      acctNumber = '1111111111';

      await execDeleteReq();
      const account = await accountModel.findByOne({ id: 1 });

      expect(account[0]).to.equal(undefined);
    });
  });
});
