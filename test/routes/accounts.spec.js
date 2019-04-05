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

    it('should return 201 for successful bank account creation', async () => {
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
});
