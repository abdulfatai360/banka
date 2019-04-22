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

describe('Password Validation Rule', () => {
  it('should return 422 when a field it is applied to is missing', async () => {
    loginCredentials = { email: faker.internet.email() };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is empty', async () => {
    loginCredentials = {
      email: faker.internet.email(),
      password: '',
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is less than 6 character long', async () => {
    loginCredentials = {
      email: faker.internet.email(),
      password: 'aaaa',
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 254 character long', async () => {
    loginCredentials = {
      email: faker.internet.email(),
      password: new Array(256).join('a'),
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not formatted as a string', async () => {
    loginCredentials = {
      email: faker.internet.email(),
      password: 111,
    };

    const res = await execSigninReq();
    expect(res).to.have.status(422);
  });
});
