import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Simple Input Validation Rule', () => {
  /*
    Simple input validation is a superset for:
    1. Integer number validation rule
    2. Floating point number validation rule
    3. Required string validation rule
    4. Account type validation rule
    5. Transaction type validation rule
   */

  // owner and accountType field of this endpoint make use
  // Intger number and Account type validation rules respectively
  let accountInfo;

  const execCreateAccountReq = async () => {
    const res = await chai.request(app)
      .post('/api/v1/accounts')
      .send(accountInfo);

    return res;
  };

  // amount and transactionType field for this endpoint
  // make use of Float and Transaction type validation rules respectively
  let transactionInfo; let accountNumber;

  const execDebitTxnReq = async () => {
    const res = await chai.request(app)
      .post(`/api/v1/transactions/${accountNumber}/debit`)
      .send(transactionInfo);

    return res;
  };

  // status field for this endpoint makes use of
  // Required string validation rules
  let reqBody;

  const execChangeStatusReq = async () => {
    const res = await chai.request(app)
      .patch(`/api/v1/accounts/${accountNumber}`)
      .send(reqBody);

    return res;
  };

  it('should return 422 when a field it is applied to is missing', async () => {
    accountInfo = { type: 'savings' };
    const res = await execCreateAccountReq();

    expect(res).to.have.status(422);
  });

  describe('Integer Number Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a non-numeric character', async () => {
      accountInfo = { owner: '1xx', type: 'savings' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(422);
    });

    it('should return 422 when a field it is applied to contains a floating point number', async () => {
      accountInfo = { owner: '1.2', type: 'savings' };
      const res = await execCreateAccountReq();

      expect(res).to.have.status(422);
    });
  });

  describe('Account Type Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a value that is neither "current" nor "savings"', async () => {
      accountInfo = { owner: '1', type: 'domicilliary' };

      const res = await execCreateAccountReq();

      expect(res).to.have.status(422);
    });
  });

  describe('Floating Point Number Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a non-numeric character', async () => {
      accountNumber = '1111111111';
      transactionInfo = {
        amount: '2xx',
        type: 'debit',
        cashier: '1',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(422);
    });

    it('should return 422 when a field it is applied to contains an integer number', async () => {
      accountNumber = '1111111111';
      transactionInfo = {
        amount: '200',
        type: 'debit',
        cashier: '1',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(422);
    });
  });

  describe('Transaction Type vVlidation Rule', () => {
    it('should return 422 when a field it is applied to contains value that is neither "debit" nor "credit"', async () => {
      accountNumber = '1111111111';
      transactionInfo = {
        amount: '200.00',
        type: 'loan',
        cashier: '1',
      };

      const res = await execDebitTxnReq();

      expect(res).to.have.status(422);
    });
  });

  describe('Required String Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a non-alphabetical character', async () => {
      accountNumber = '1111111111';
      reqBody = { status: 'hello1' };

      const res = await execChangeStatusReq();

      expect(res).to.have.status(422);
    });
  });
});