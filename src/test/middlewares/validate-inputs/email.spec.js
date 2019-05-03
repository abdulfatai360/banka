import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../../index';

const { expect } = chai;
chai.use(chaiHttp);

let user;

const execSignupReq = async () => {
  const res = await chai.request(app)
    .post('/api/v1/auth/signup')
    .send(user);

  return res;
};

describe('Email Validation Rule', () => {
  it('should return 422 when a field it is applied to is missing', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is empty', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: '',
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is less than 3 character long', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: 'a@',
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 254 character long', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: `${new Array(256).join('a')}@domain.com`,
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is an invalid email address', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: 'aaa',
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not formatted as a string', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: 111,
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });
});
