import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/index';

const { expect } = chai;
chai.use(chaiHttp);

describe('User Login Input Validation Rule', () => {
  /*
    User login input validation is a superset for:
    1. Email validation rule
    2. Password validation rule
   */

  let loginCredentials;

  const execSigninReq = async () => {
    const res = await chai.request(app)
      .post('/api/v1/auth/signin')
      .send(loginCredentials);

    return res;
  };

  it('should return 422 when a field it is applied to is missing', async () => {
    loginCredentials = {
      password: 'abdusobur@domain.com',
    };

    const res = await execSigninReq();

    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to is empty', async () => {
    loginCredentials = {
      email: 'abdusobur@domain.com',
      password: '',
    };

    const res = await execSigninReq();

    expect(res).to.have.status(422);
  });

  it('should return 422 when a field it is applied to contains a value that is more than 254 character long', async () => {
    loginCredentials = {
      email: 'abdusobur@domain.com',
      password: new Array(256).join('a'),
    };

    const res = await execSigninReq();

    expect(res).to.have.status(422);
  });

  describe('Email Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a value that is less than 3 character long', async () => {
      loginCredentials = {
        email: 'a@',
        password: 'abdusobur@domain.com',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(422);
    });

    it('should return 422 when a field it is applied to contains a value that is an invalid email address', async () => {
      loginCredentials = {
        email: 'aaa',
        password: 'abdusobur@domain.com',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(422);
    });
  });

  describe('Password Validation Rule', () => {
    it('should return 422 when a field it is applied to contains a value that is less than 6 character long', async () => {
      loginCredentials = {
        email: 'abdusobur@domain.com',
        password: 'aaaa',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(422);
    });
  });
});
