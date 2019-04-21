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

  describe('PATCH /accounts/<account-number>', () => {
    let acctNumber; let reqBody;

    const execChangeStatusReq = async () => {
      const res = await chai.request(app)
        .patch(`/api/v1/accounts/${acctNumber}`)
        .send(reqBody);

      return res;
    };

    beforeEach('Create-Account-Create-Account-Table-Test', async () => {
      await db.query(accountTable.createTable);
      await seedAccount();
    });

    afterEach('Create-Account-Drop-Account-Table-Test', async () => {
      await db.query(accountTable.dropTable);
    });

    it('should return 400 if an invalid account number is supplied', async () => {
      acctNumber = '0000000000';
      reqBody = { accountStatus: 'active' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.an('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 when an account status is changed', async () => {
      acctNumber = '1111111111'; // value in seeded data
      reqBody = { accountStatus: 'active' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
    });

    it('should return the account new status and update it in the database', async () => {
      acctNumber = '1111111111';
      reqBody = { accountStatus: 'dormant' };

      const res = await execChangeStatusReq();
      let account = await accountModel.findByAccountNumber('1111111111');
      [account] = account;

      expect(res.body).to.have.own.property('data');
      expect(res.body.data[0]).to.have.own.property('accountStatus');
      expect(res.body.data[0].accountStatus).to.match(/dormant/i);
      expect(account.account_status).to.match(/dormant/i);
    });
  });
});
