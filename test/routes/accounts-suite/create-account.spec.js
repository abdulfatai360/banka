import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';
import db from '../../../src/database';
import userModel from '../../../src/database/models/user';
import accountModel from '../../../src/database/models/account';
import seedUsers from '../../../src/database/seeders/seed-users';
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

  describe('POST /accounts', () => {
    let accountInfo;

    const execCreateAccountReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/accounts')
        .send(accountInfo);

      return res;
    };

    beforeEach('Create-Account-Create-Account-Table-Test', async () => {
      await db.query(accountTable.createTable);
    });

    afterEach('Create-Account-Drop-Account-Table-Test', async () => {
      await db.query(accountTable.dropTable);
    });

    it('should return 400 when specified account owner is invalid', async () => {
      accountInfo = {
        ownerId: '0',
        accountType: 'savings',
        openingBalance: '1000.00',
      };

      const res = await execCreateAccountReq();
      expect(res).to.have.status(400);
    });

    it('should create a new account and save it in account DB', async () => {
      accountInfo = {
        ownerId: '3',
        accountType: 'savings',
        openingBalance: '1000.00',
      };

      const res = await execCreateAccountReq();
      const accountList = await accountModel.findAll();

      expect(res).to.have.status(201);
      expect(accountList[0].owner_id).to.equal(3);
      expect(accountList[0].account_type).to.match(/^savings$/i);
      expect(accountList[0].account_status).to.match(/^draft$/i);
      expect(accountList[0].opening_balance).to.equal('1000.00');
      expect(accountList[0].balance).to.equal('0.00');
    });

    it('should return 201 for when a new account is created', async () => {
      accountInfo = {
        ownerId: '3',
        accountType: 'savings',
        openingBalance: '1000.00',
      };

      const res = await execCreateAccountReq();
      expect(res).to.have.status(201);
    });

    it('should return some info about the account and its owner', async () => {
      accountInfo = {
        ownerId: '3',
        accountType: 'savings',
        openingBalance: '1000.00',
      };

      const res = await execCreateAccountReq();

      const acctOwner = await userModel.findByOne({ id: 3 });
      const resBody = res.body.data[0];

      expect(resBody.firstName).to.have.string(acctOwner[0].first_name);
      expect(resBody.lastName).to.have.string(acctOwner[0].last_name);
      expect(resBody.email).to.have.string(acctOwner[0].email);
      expect(resBody.accountType).to.match(/^savings$/i);
      expect(resBody.openingBalance).to.equal('1000.00');
    });
  });
});
