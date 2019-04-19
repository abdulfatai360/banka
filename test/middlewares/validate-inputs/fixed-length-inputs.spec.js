import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Fixed Length Input Validation Rule', () => {
  /*
    Fixed length input validation is a superset for:
    1. Account number validation rule
   */

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
