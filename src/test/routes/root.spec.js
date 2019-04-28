import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Root Route', () => {
  it('should return status 200', async () => {
    const res = await chai.request(app).get('/');

    expect(res).to.have.status(200);
    expect(res.body).to.have.ownProperty('message');
  });
});
