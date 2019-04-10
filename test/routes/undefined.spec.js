import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../src/index';

chai.use(chaiHttp);
const { expect } = chai;

describe('Undefined Routes', () => {
  it('should return status 404 and error message', async () => {
    const res = await chai.request(app).get('/undefined');

    expect(res).to.have.status(404);
    expect(res.body).to.have.own.property('error');
  });
});
