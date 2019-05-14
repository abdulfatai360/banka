import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import app from '../../index';
import db from '../../database';
import seedUsersTable from '../../database/seeders/seed-users';
import * as userTable from '../../database/tables/user-table';

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

    before('User-Signup-Migration-Up', async () => {
      await db.query(userTable.createTable);
    });

    after('User-Signup-Migration-Down', async () => {
      await db.query(userTable.dropTable);
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
      const userDetails = res.body.data[0];

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

    before('User-Signin-Migration-Up', async () => {
      await db.query(userTable.createTable);
      await seedUsersTable();
    });

    after('User-Signin-Migration-Down', async () => {
      await db.query(userTable.dropTable);
    });

    it('should return 400 any of the login credentials is invalid', async () => {
      loginCredentials = {
        email: 'invalidemail@domain.com',
        password: 'invalidpassword',
      };

      const res = await execSigninReq();

      expect(res).to.have.status(401);
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
      expect(res.body.data[0].email).to.match(/admin@domain.com/i);
    });
  });
});
