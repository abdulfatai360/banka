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

describe('Password Validation Rule', () => {
  it('should return 422 when a field it is applied to is missing', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is empty', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: '',
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is less than 6 character long', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: 'aaaa',
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 254 character long', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: new Array(256).join('a'),
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is not formatted as a string', async () => {
    user = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: '2341111111111',
      email: faker.internet.email(),
      password: 111,
    };

    const res = await execSignupReq();
    expect(res).to.have.status(422);
  });
});
