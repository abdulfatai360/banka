import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../index';
import db from '../../../database';
import userModel from '../../../database/models/user';
import accountModel from '../../../database/models/account';
import seedUsersTable from '../../../database/seeders/seed-users';
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

  describe('POST /accounts', () => {
    let newAccountInfo; let userAuthToken;

    before('Create-Account-Endpoint-Login-Client', async () => {
      const response = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send({
          email: 'client@domain.com',
          password: 'client@domain.com',
        });

      userAuthToken = response.body.data[0].token;
    });

    beforeEach('Create-Account-Create-Account-Table-Test', async () => {
      await db.query(accountTable.createTable);
    });

    afterEach('Create-Account-Drop-Account-Table-Test', async () => {
      await db.query(accountTable.dropTable);
    });

    const execCreateAccountReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/accounts')
        .set('x-auth-token', userAuthToken)
        .send(newAccountInfo);

      return res;
    };

    it('should create a new account and save it in account DB', async () => {
      newAccountInfo = {
        accountType: 'savings',
        openingBalance: '1000',
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
      newAccountInfo = {
        accountType: 'savings',
        openingBalance: '1000',
      };

      const res = await execCreateAccountReq();
      expect(res).to.have.status(201);
    });

    it('should return some info about the account and its owner', async () => {
      newAccountInfo = {
        accountType: 'savings',
        openingBalance: '1000',
      };

      const res = await execCreateAccountReq();

      // id of login client is 3 in seeded data
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
