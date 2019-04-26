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

describe('User Name Input Validation Rule', () => {
  it('should return 422 when a field it is applied to is empty', async () => {
    user = {
      firstName: '',
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is missing', async () => {
    user = {
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is less than 2 character long', async () => {
    user = {
      firstName: 'A',
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 50 character long', async () => {
    user = {
      firstName: new Array(52).join('a'),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is considered an invalid name', async () => {
    user = {
      firstName: 'Adej@re',
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not formatted as a string', async () => {
    user = {
      firstName: 111,
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });
});
