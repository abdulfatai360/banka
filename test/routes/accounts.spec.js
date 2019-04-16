/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import seedUserDb from './auth.spec';
import { accountModel, accountSerial } from '../../src/models/account';
import { userModel, userSerial } from '../../src/models/user';

const { expect } = chai;
chai.use(chaiHttp);

const seedAccountDb = () => {
  const acctInfoFromClient = [
    {
      owner: '1',
      type: 'savings',
      status: 'draft',
      openingBalance: 0.00,
      balance: 0.00,
    },
    {
      owner: '2',
      type: 'current',
      status: 'draft',
      openingBalance: 0.00,
      balance: 0.00,
    },
  ];

  for (let i = 0; i < acctInfoFromClient.length; i += 1) {
    accountModel.create(acctInfoFromClient[i]);
  }
};

describe('/accounts', () => {
  before('Populate user database', async () => { await seedUserDb(); });

  after('Clears user database and its serial generator', () => {
    userModel.deleteAll();
    userSerial.reset();
  });

  describe('POST /accounts', () => {
    let accountInfo;

    const execCreateAccountReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/accounts')
        .send(accountInfo);

      return res;
    };

    afterEach('Clears Account database and its serial generator', () => {
      accountModel.deleteAll();
      accountSerial.reset();
    });

    it('should return 400 when specified account owner is invalid', async () => {
      accountInfo = { owner: '0', type: 'current' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(400);
    });

    it('should create a new account and save it in account DB', async () => {
      accountInfo = { owner: '1', type: 'savings' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(201);
      expect(accountModel.findAll()[0].owner).to.equal(1);
    });

    it('should return 201 for when a new account is created', async () => {
      accountInfo = { owner: '1', type: 'savings' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(201);
    });

    it('should return some info about the bank account and its owner', async () => {
      accountInfo = { owner: '1', type: 'savings' };
      const res = await execCreateAccountReq();

      const acctOwner = userModel.findById(1);
      const resBody = res.body.data;

      expect(resBody.email).to.have.string(acctOwner.email);
      expect(resBody.type).to.match(/savings/i);
    });
  });

  describe('PATCH /accounts/<account-number>', () => {
    let accountNumber; let reqBody;

    const execChangeStatusReq = async () => {
      const res = await chai.request(app)
        .patch(`/api/v1/accounts/${accountNumber}`)
        .send(reqBody);

      return res;
    };

    before('Populate Account database', () => {
      seedAccountDb();
    });

    after('Clears Account database and its serial generator', () => {
      accountModel.deleteAll();
      accountSerial.reset();
    });

    it('should return 400 if an invalid account number is supplied', async () => {
      accountNumber = '0000000000';
      reqBody = { status: 'active' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(400);
      expect(res.body).to.have.own.property('error');
    });

    it('should return 200 when an account status is changed', async () => {
      const accountRecord = accountModel.findById(1);

      accountNumber = accountRecord.accountNumber;
      reqBody = { status: 'active' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(200);
      expect(res.body).to.have.own.property('data');
    });

    it('should change the account status and returns its new status', async () => {
      const accountRecord = accountModel.findById(1);

      accountNumber = accountRecord.accountNumber;
      reqBody = { status: 'dormant' };

      const res = await execChangeStatusReq();

      expect(accountRecord.status).to.match(/dormant/i);
      expect(res.body.data)
        .to.have.own.property('status')
        .that.matches(/dormant/i);
    });
  });

  describe('DELETE /accounts/<account-number>', () => {
    let accountNumber;

    const execDeleteReq = async () => {
      const res = await chai.request(app)
        .delete(`/api/v1/accounts/${accountNumber}`);

      return res;
    };

    beforeEach('Populate account database', () => { seedAccountDb(); });

    afterEach('Clears user database and its serial generator', () => {
      accountModel.deleteAll();
      accountSerial.reset();
    });

    it('should return 400 for invalid account number', async () => {
      accountNumber = '1111111111';
      const res = await execDeleteReq();

      expect(res).to.have.status(400);
      expect(res.body).to.have.own.property('error');
    });

    it('should return 200 when an account is deleted', async () => {
      const account = accountModel.findById(1);
      accountNumber = account.accountNumber;

      const res = await execDeleteReq();

      expect(res).to.have.status(200);
      expect(res.body).to.have.own.property('message');
    });

    it('should delete the account in the database', async () => {
      let account = accountModel.findById(1);
      accountNumber = account.accountNumber;

      await execDeleteReq();

      account = accountModel.findById(1);
      // eslint-disable-next-line no-unused-expressions
      expect(account).to.be.undefined;
    });
  });
});

export default seedAccountDb;
