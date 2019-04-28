import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Simple Input Validation Rule', () => {
  /*
    Simple input validation is a superset for:
    1. Integer number
    2. Floating point number
    3. Required string
    4. Account type
    5. Transaction type
    7. Phone
   */

  let accountInfo;
  let transactionInfo;
  let accountNumber;
  let reqBody;
  let user;
  let transactionId;

  const execCreateAccountReq = async () => {
    const res = await chai.request(app)
      .post('/api/v1/accounts')
      .send(accountInfo);

    return res;
  };

  const execDebitTxnReq = async () => {
    const res = await chai.request(app)
      .post(`/api/v1/transactions/${accountNumber}/debit`)
      .send(transactionInfo);

    return res;
  };

  const execChangeStatusReq = async () => {
    const res = await chai.request(app)
      .patch(`/api/v1/accounts/${accountNumber}`)
      .send(reqBody);

    return res;
  };

  const execSignupReq = async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user);

    return res;
  };

  const execGetTransactionReq = async () => {
    const res = await chai.request(app)
      .get(`/api/v1/transactions/${transactionId}`);

    return res;
  };

  it('should return 422 when a field it is applied to is empty', async () => {
    accountInfo = { accountType: '', openingBalance: '100.00' };

    const res = await execCreateAccountReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is missing', async () => {
    accountInfo = { openingBalance: '100.00' };

    const res = await execCreateAccountReq();
    expect(res).to.have.status(422);
  });

  describe('Integer Number', () => {
    it('should return 422 when a field it is applied to contains a non-numeric character', async () => {
      transactionId = '1xx';

      const res = await execGetTransactionReq();
      expect(res).to.have.status(422);
    });

    it('should return 422 when a field it is applied to contains a floating point number', async () => {
      transactionId = '1.2';

      const res = await execGetTransactionReq();
      expect(res).to.have.status(422);
    });
  });

  describe('Account Type', () => {
    it('should return 422 when a field it is applied to contains a value that is neither "current" nor "savings"', async () => {
      accountInfo = { accountType: 'loan', openingBalance: '100.00' };

      const res = await execCreateAccountReq();
      expect(res).to.have.status(422);
    });
  });

  describe('Floating Point Number', () => {
    it('should return 422 when a field it is applied to contains a non-numeric character', async () => {
      accountInfo = { accountType: 'loan', openingBalance: '-100.00' };

      const res = await execCreateAccountReq();
      expect(res).to.have.status(422);
    });
  });

  describe('Transaction Type', () => {
    it('should return 422 when a field it is applied to contains value that is neither "debit" nor "credit"', async () => {
      accountNumber = '1111111111';
      transactionInfo = {
        amount: '200.00',
        transactionType: 'loan',
      };

      const res = await execDebitTxnReq();
      expect(res).to.have.status(422);
    });
  });

  describe('Required String', () => {
    it('should return 422 when a field it is applied to contains a non-alphabetical character', async () => {
      accountNumber = '1111111111';
      reqBody = { accountStatus: 'hello1' };

      const res = await execChangeStatusReq();
      expect(res).to.have.status(422);
    });
  });

  describe('Phone Number', () => {
    it('should return 422 when a field it is applied to contains a value that is not valid', async () => {
      user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: '080111111111', // valid: +234xxxxxxxxxx or 234xxxxxxxxxx
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const res = await execSignupReq();
      expect(res).to.have.status(422);
    });
  });
});
