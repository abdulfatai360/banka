import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

describe('Name Input Validation Rule', () => {
  /*
    Name input validation is a superset for:
    1. Required name validation rule
    2. Optional name validation rule
   */

  let user;

  const execSignupReq = async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user);

    return res;
  };

  it('should return 422 when a field it is applied to contains a value that is less than 2 character long', async () => {
    user = {
      firstName: 'A',
      lastName: 'Sobur',
      otherName: 'Ayomide',
      phone: '08011111111',
      email: 'abdusobur@domain.com',
      password: 'abdusobur@domain.com',
    };

    const res = await execSignupReq();

    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 50 character long', async () => {
    user = {
      firstName: new Array(52).join('a'),
      lastName: 'Sobur',
      otherName: 'Ayomide',
      phone: '08011111111',
      email: 'abdusobur@domain.com',
      password: 'abdusobur@domain.com',
    };

    const res = await execSignupReq();

    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is considered an invalid name', async () => {
    user = {
      firstName: 'Adej@re',
      lastName: 'Sobur',
      otherName: 'Ayomide',
      phone: '08011111111',
      email: 'abdusobur@domain.com',
      password: 'abdusobur@domain.com',
    };

    const res = await execSignupReq();

    expect(res).to.have.status(422);
  });

  describe('Required Name Validation Rule', () => {
    it('should return 422 when a field it is applied to is missing', async () => {
      user = {
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '08011111111',
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(422);
    });
  });
});
