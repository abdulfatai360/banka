/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import { userModel, sequence } from '../../src/models/user';
import hashPassword from '../../src/utilities/hash-password';

const { expect } = chai;
chai.use(chaiHttp);

const seedDb = async () => {
  const users = [
    {
      firstName: 'Leanne',
      lastName: 'Graham',
      otherName: 'Millan',
      phone: '08077073680',
      email: 'sincere@april.biz',
      password: 'sincere@april.biz',
    },
    {
      firstName: 'Ervin',
      lastName: 'Howell',
      otherName: 'Darwin',
      phone: '08106926593',
      email: 'shanna@melissa.tv',
      password: 'shanna@melissa.tv',
      type: 'staff',
    },
  ];

  for (let i = 0; i < users.length; i += 1) {
    users[i].password = await hashPassword.generateHash(users[i].password);
    userModel.create(users[i]);
  }
};

describe('/auth', () => {
  describe('POST /auth/signup', () => {
    afterEach('clear user DB and reset sequence generator', async () => {
      userModel.deleteAll();
      sequence.reset();
    });

    let user;

    const execSignupReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      return res;
    };

    it('should return 201 for successful user signup', async () => {
      user = {
        firstName: 'Abdus',
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '08077073680',
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(201);
      expect(res.body).to.have.ownProperty('status');
    });

    it('should create a new user account and returns details in response body', async () => {
      user = {
        firstName: 'Abdus',
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '08077073680',
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execSignupReq();
      const userDetails = res.body.data;

      expect(userDetails).to.be.an('object');
      expect(userDetails.email).to.match(/abdusobur@domain.com/i);
    });

    it('should return 409 if user registers with an existing email', async () => {
      await seedDb();

      user = {
        firstName: 'Leanne',
        lastName: 'Graham',
        otherName: 'Millan',
        phone: '08077073680',
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(409);
    });
  });

  describe('POST /auth/signin', () => {
    before('Populate the user database', async () => {
      await seedDb();
    });

    after('Clears user database and reset serial generator', () => {
      userModel.deleteAll();
      sequence.reset();
    });

    let loginCredentials;

    const execSigninReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginCredentials);

      return res;
    };

    it('should return 400 for invalid login credentials', async () => {
      loginCredentials = {
        email: 'invalidemail@domain.com',
        password: 'invalidpassword',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(400);
      expect(res.body)
        .to.have.ownProperty('error')
        .that.is.a('string');
    });

    it('should return 200 for valid login credentials', async () => {
      loginCredentials = {
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(200);
    });

    it('should return user details in response body after successful login', async () => {
      loginCredentials = {
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execSigninReq();

      expect(res.body.data.email).to.match(/sincere@april.biz/i);
    });
  });
});
