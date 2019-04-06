/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
import '@babel/polyfill';
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
    { owner: '1', type: 'savings' },
    { owner: '2', type: 'current' },
  ];

  for (let i = 0; i < acctInfoFromClient.length; i += 1) {
    accountModel.create(acctInfoFromClient[i]);
  }
};

describe('/accounts', () => {
  describe('POST /accounts', () => {
    let accountInfo;

    const execCreateAccountReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/accounts')
        .send(accountInfo);

      return res;
    };

    afterEach('Clears databases', () => {
      userModel.deleteAll();
      accountModel.deleteAll();
      userSerial.reset();
      accountSerial.reset();
    });

    it('should return 400 when specified account owner is invalid', async () => {
      accountInfo = { owner: '1', type: 'current' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(400);
    });

    it('should create a new account and save it in account DB', async () => {
      await seedUserDb();
      accountInfo = { owner: '1', type: 'savings' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(201);
      expect(accountModel.findAll()[0].owner).to.equal(1);
    });

    it('should return 201 for when a new account is created', async () => {
      await seedUserDb();
      accountInfo = { owner: '1', type: 'savings' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(201);
    });

    it('should return some info about the bank account and its owner', async () => {
      await seedUserDb();
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

    before('Seed user and account DB', async () => {
      await seedUserDb();
      seedAccountDb();
    });

    after('Clears dependencies', () => {
      userModel.deleteAll();
      userSerial.reset();
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

      // eslint-disable-next-line prefer-destructuring
      accountNumber = accountRecord.accountNumber;
      reqBody = { status: 'active' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(200);
      expect(res.body).to.have.own.property('data');
    });

    it('should change the account status and returns its new status', async () => {
      const accountRecord = accountModel.findById(1);

      // eslint-disable-next-line prefer-destructuring
      accountNumber = accountRecord.accountNumber;
      reqBody = { status: 'dormant' };

      const res = await execChangeStatusReq();

      expect(accountRecord.status).to.match(/dormant/i);
      expect(res.body.data)
        .to.have.own.property('status')
        .that.matches(/dormant/i);
    });
  });
});
