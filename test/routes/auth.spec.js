import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import { userModel, userSerial } from '../../src/models/user';
import hashPassword from '../../src/utilities/hash-password';

const { expect } = chai;
chai.use(chaiHttp);

const seedUserDb = async () => {
  const users = [
    {
      firstName: 'Leanne',
      lastName: 'Graham',
      otherName: 'Millan',
      phone: '2348077073680',
      email: 'sincere@april.biz',
      password: 'sincere@april.biz',
    },
    {
      firstName: 'Ervin',
      lastName: 'Howell',
      otherName: 'Darwin',
      phone: '2348106926593',
      email: 'shanna@melissa.tv',
      password: 'shanna@melissa.tv',
    },
    {
      firstName: 'First',
      lastName: 'Last',
      otherName: 'Other',
      phone: '2348106926593',
      email: 'cashier@domain.com',
      password: 'cashier@domain.com',
      type: 'staff',
      isAdmin: false,
    },
  ];

  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    const hash = await hashPassword.generateHash(user.password);
    user.password = hash;
    userModel.create(user);
  }
};

describe('/auth', () => {
  describe('POST /auth/signup', () => {
    let user;

    const execSignupReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      return res;
    };

    afterEach('clears and reset user database', async () => {
      userModel.deleteAll();
      userSerial.reset();
    });

    it('should return 201 when a user account is created', async () => {
      user = {
        firstName: 'Abdus',
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '2348077073680',
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(201);
      expect(res.body).to.have.ownProperty('status');
    });

    it('should create a user account and returns its details', async () => {
      user = {
        firstName: 'Abdus',
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '2348077073680',
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execSignupReq();
      const userDetails = res.body.data;

      expect(userDetails).to.be.an('object');
      expect(userDetails.email).to.match(/abdusobur@domain.com/i);
    });

    it('should return 409 when user registers with an existing email', async () => {
      await seedUserDb();

      user = {
        firstName: 'Leanne',
        lastName: 'Graham',
        otherName: 'Millan',
        phone: '2348077073680',
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(409);
    });
  });

  describe('POST /auth/signin', () => {
    let loginCredentials;

    const execSigninReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signin')
        .send(loginCredentials);

      return res;
    };

    before('Populate the user database', async () => {
      await seedUserDb();
    });

    after('Clears and reset external dependencies', () => {
      userModel.deleteAll();
      userSerial.reset();
    });

    it('should return 400 any of the login credentials is invalid', async () => {
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

    it('should return 200 when a user logs in', async () => {
      loginCredentials = {
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(200);
    });

    it('should return user details after successful login', async () => {
      loginCredentials = {
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execSigninReq();

      expect(res.body.data.email).to.match(/sincere@april.biz/i);
    });
  });
});

export default seedUserDb;
