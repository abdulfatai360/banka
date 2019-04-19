import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../src/index';
import db from '../../src/database';
import userSeeder from '../../src/database/seeders/users';
import * as userTable from '../../src/database/tables/user-table';

const { expect } = chai;
chai.use(chaiHttp);

describe.only('/auth', () => {
  describe('POST /auth/signup', () => {
    let user;

    const execSignupReq = async () => {
      const res = await chai.request(app)
        .post('/api/v1/auth/signup')
        .send(user);

      return res;
    };

    before('Migrations Up', async () => {
      try {
        await db.query(userTable.createTable);
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

    it('should return 201 when a user account is created', async () => {
      user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: '2341111111111',
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const res = await execSignupReq();

      expect(res).to.have.status(201);
      expect(res.body).to.have.ownProperty('status');
    });

    it('should create a user account and returns its details', async () => {
      user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: '2341111111111',
        email: 'sample@domain.com',
        password: faker.internet.password(),
      };

      const res = await execSignupReq();
      const userDetails = res.body.data;

      expect(userDetails).to.be.an('object');
      expect(userDetails.email).to.match(/sample@domain.com/i);
      expect(userDetails.type).to.match(/client/i);
    });

    it('should return 409 when user registers with an existing email', async () => {
      user = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        phone: '2341111111111',
        email: 'sample@domain.com',
        password: faker.internet.password(),
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
        email: 'admin@domain.com',
        password: 'admin@domain.com',
      };

      const res = await execSigninReq();
      expect(res).to.have.status(200);
    });

    it('should return user details after successful login', async () => {
      loginCredentials = {
        email: 'admin@domain.com',
        password: 'admin@domain.com',
      };

      const res = await execSigninReq();
      expect(res.body.data.email).to.match(/admin@domain.com/i);
    });
  });
});
