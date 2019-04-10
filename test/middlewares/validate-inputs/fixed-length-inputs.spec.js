import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Fixed Length Input Validation Rule', () => {
  /*
    Fixed length input validation is a superset for:
    1. Phone validation rule
    2. Account number validation rule
   */

  // phone field for this endpoint makes use of the phone validation rule
  let user;

  const execSignupReq = async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user);

    return res;
  };

  // accountNumber param for this endpoint makes use of the account number validation rule
  let transactionInfo; let accountNumber;

  const execDebitTxnReq = async () => {
    const res = await chai.request(app)
      .post(`/api/v1/transactions/${accountNumber}/debit`)
      .send(transactionInfo);

    return res;
  };

  it('should return 422 when a field it is applied to is missing', async () => {
    transactionInfo = {
      amount: '200.00',
      type: 'debit',
      cashier: '1',
    };

    const res = await execDebitTxnReq();

    expect(res).to.have.status(422);
  });

  describe('Phone Number Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a value that is not 11 character long', async () => {
      user = {
        firstName: 'Abdus',
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '080111111111', // this is 12-char long
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(422);
    });
  });

  describe('Account Number Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a value that is not 10 character long', async () => {
      accountNumber = '111111111'; // this is 11-char long
      transactionInfo = {
        amount: '200.00',
        type: 'debit',
        cashier: '1',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(422);
    });
  });
});
