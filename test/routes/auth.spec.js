/* eslint-disable no-return-await */
/* eslint-disable no-await-in-loop */
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import db from '../../src/database';
import userSeeder from '../../src/database/seeders/users';
import * as userTable from '../../src/database/tables/user-table';

const { expect } = chai;
chai.use(chaiHttp);

describe('/auth', () => {
  describe('POST /auth/signup', () => {
    let user;

    const execSignupReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      return res;
    };

    beforeEach('Migrations Up', async () => {
      try {
        await db.query(userTable.createTable);
      } catch (err) {
        console.log('Migrations up in test: ', err.message);
      }
    });

    afterEach('Migration Down', async () => {
      try {
        await db.query(userTable.dropTable);
      } catch (err) {
        console.log('Migrations down in test: ', err.message);
      }
    });

    it('should return 201 when a user account is created', async () => {
      user = {
        firstName: 'First',
        lastName: 'Last',
        otherName: 'Other',
        phone: '08077073680',
        email: 'sample@domain.com',
        password: 'sample@domain.com',
      };

      const res = await execSignupReq();

      expect(res).to.have.status(201);
      expect(res.body).to.have.ownProperty('status');
    });

    it('should create a user account and returns its details', async () => {
      user = {
        firstName: 'First',
        lastName: 'Last',
        otherName: 'Other',
        phone: '08077073680',
        email: 'sample@domain.com',
        password: 'sample@domain.com',
      };

      const res = await execSignupReq();
      const userDetails = res.body.data;

      expect(userDetails).to.be.an('object');
      expect(userDetails.email).to.match(/sample@domain.com/i);
      expect(userDetails.type).to.match(/client/i);
    });

    it('should return 409 when user registers with an existing email', async () => {
      // this user data is already pre-poluated in the database
      // check the 'src/database/seeders/users.js' file
      try {
        await userSeeder();
      } catch (err) {
        console.log('From seeding UserDB in test: ', err.message);
      }

      user = {
        firstName: 'Abdul',
        lastName: 'Fatai',
        otherName: 'Jimoh',
        phone: '08077073680',
        email: 'oluphetty@gmail.com',
        password: 'oluphetty',
        type: 'Client',
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

    before('Migrations Up', async () => {
      try {
        await db.query(userTable.createTable);
        await userSeeder();
      } catch (err) {
        console.log('Migrations up in test: ', err.message);
      }
    });

    after('Migration Down', async () => {
      try {
        await db.query(userTable.dropTable);
      } catch (err) {
        console.log('Migrations down in test: ', err.message);
      }
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
        email: 'ganiyah.adeola@gmail.com',
        password: 'ganiyah.adeola@gmail.com',
      };

      const res = await execSigninReq();
      expect(res).to.have.status(200);
    });

    it('should return user details after successful login', async () => {
      loginCredentials = {
        email: 'oluphetty@gmail.com',
        password: 'oluphetty@gmail.com',
      };

      const res = await execSigninReq();
      expect(res.body.data.email).to.match(/oluphetty@gmail.com/i);
    });
  });
});
