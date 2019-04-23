import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';
import seedUsers from '../../src/database/seeders/seed-users';
import seedAccount from '../../src/database/seeders/seed-account';
import * as allTables from '../../src/database/tables/all-tables';

const { expect } = chai;
chai.use(chaiHttp);

describe('/user', () => {
  before('User-Endpoints-Migration-Up-Test', async () => {
    await allTables.tablesUp();
    await seedUsers();
    await seedAccount();
  });

  after('User-Endpoints-Migration-Down-Test', async () => {
    await allTables.tablesDown();
  });

  describe('GET /user/<user-email-address>/accounts', () => {
    let userEmailAddress;

    const execGetUsersAccountReq = async () => {
      const res = await chai.request(app)
        .get(`/api/v1/user/${userEmailAddress}/accounts`);

      return res;
    };

    it('should return 400 for invalid email address', async () => {
      userEmailAddress = 'invalid@domain.com'; // invalid email

      const res = await execGetUsersAccountReq();

      expect(res).to.have.status(400);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 404 if the user does not have an account', async () => {
      userEmailAddress = 'client2@domain.com'; // user with no account in seeded data

      const res = await execGetUsersAccountReq();

      expect(res).to.have.status(404);
      expect(res.status).to.be.a('number');
      expect(res.body).to.have.own.property('error');
      expect(res.body.error).to.be.a('string');
    });

    it('should return 200 and the accounts associated to the email', async () => {
      userEmailAddress = 'client@domain.com'; // user with account in seeded data

      const res = await execGetUsersAccountReq();
      const resBody = res.body;

      expect(res).to.have.status(200);
      expect(res.status).to.be.a('number');
      expect(resBody).to.have.own.property('data');
      expect(resBody.data).to.be.an('array');
      resBody.data.forEach(acct => expect(acct.ownerEmail === 'client@domain.com'));
    });
  });
});
