import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

let loginCredentials;

const execSigninReq = async () => {
  const res = await chai.request(app)
    .post('/api/v1/auth/signin')
    .send(loginCredentials);

  return res;
};

describe('Email Validation Rule', () => {
  it('should return 422 when a field it is applied to is missing', async () => {
    loginCredentials = { password: faker.internet.password() };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is empty', async () => {
    loginCredentials = {
      email: '',
      password: faker.internet.password(),
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is less than 3 character long', async () => {
    loginCredentials = {
      email: 'a@',
      password: faker.internet.password(),
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 254 character long', async () => {
    loginCredentials = {
      email: `${new Array(256).join('a')}@domain.com`,
      password: faker.internet.password(),
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is an invalid email address', async () => {
    loginCredentials = {
      email: 'aaa',
      password: faker.internet.password(),
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not formatted as a string', async () => {
    loginCredentials = {
      email: 111,
      password: faker.internet.password(),
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });
});
