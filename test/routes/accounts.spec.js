import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import db from '../../src/database';
import userModel from '../../src/database/models/user';
import accountModel from '../../src/database/models/account';
import seedUsers from '../../src/database/seeders/seed-users';
import seedAccount from '../../src/database/seeders/seed-account';
import * as accountTable from '../../src/database/tables/account-table';
import * as allTables from '../../src/database/tables/all-tables';

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

      const acctOwner = await userModel.findById(3);
      const resBody = res.body.data[0];

      expect(resBody.firstName).to.have.string(acctOwner[0].first_name);
      expect(resBody.lastName).to.have.string(acctOwner[0].last_name);
      expect(resBody.email).to.have.string(acctOwner[0].email);
      expect(resBody.accountType).to.match(/^savings$/i);
      expect(resBody.openingBalance).to.equal('1000.00');
    });
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
      const account = await accountModel.findById(1);

      expect(account[0]).to.equal(undefined);
    });
  });
});
