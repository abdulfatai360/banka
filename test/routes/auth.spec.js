/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
import '@babel/polyfill';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import { userModel, sequence } from '../../src/models/user';

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
    await userModel.create(users[i]);
  }
};

describe('/auth', () => {
  describe('POST /auth/signup', () => {
    afterEach(async () => {
      userModel.deleteAll();
      sequence.reset();
    });

    let user;

    const execPostReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      return res;
    };

    it('should return status code 201', async () => {
      user = {
        firstName: 'Abdus',
        lastName: 'Sobur',
        otherName: 'Ayomide',
        phone: '08077073680',
        email: 'abdusobur@domain.com',
        password: 'abdusobur@domain.com',
      };

      const res = await execPostReq();

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

      const res = await execPostReq();
      const userDetails = res.body.data;

      expect(userDetails).to.be.an('object');
      expect(userDetails.email).to.match(/abdusobur@domain.com/i);
    });

    it('should return status code 409 if user registers with an existing email', async () => {
      await seedDb();

      user = {
        firstName: 'Leanne',
        lastName: 'Graham',
        otherName: 'Millan',
        phone: '08077073680',
        email: 'sincere@april.biz',
        password: 'sincere@april.biz',
      };

      const res = await execPostReq();

      expect(res).to.have.status(409);
    });
  });
});
