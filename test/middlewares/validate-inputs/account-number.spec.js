import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

let accountNumber;

const execGetAccountReq = async () => {
  const res = await chai.request(app)
    .get(`/api/v1/accounts/${accountNumber}`);

  return res;
};

describe('Account Number Validation Rule', () => {
  it('should return 404 when a field it is applied to is empty', async () => {
    accountNumber = '';

    const res = await execGetAccountReq();
    expect(res).to.have.status(404);
  });

  it('should return 422 when a field it is applied to is missing', async () => {
    accountNumber = undefined;

    const res = await execGetAccountReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not 10 character long', async () => {
    accountNumber = '111111111'; // this is 11-char long

    const res = await execGetAccountReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not formatted as a string', async () => {
    accountNumber = 11111111;

    const res = await execGetAccountReq();
    expect(res).to.have.status(422);
  });
});
