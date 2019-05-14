import winston from 'winston';
import HttpResponse from '../utilities/http-response';

const handleServerError = (error, req, res, next) => {
  winston.error(error.message);
  if (/TokenExpiredError/i.test(error.name)) {
    return HttpResponse.send(res, 401, { error: 'Your session has expired. Please login again to continue' });
  }

  if (/JsonWebTokenError/i.test(error.name)) {
    return HttpResponse.send(res, 401, { error: 'Invalid authorization credentials' });
  }

  return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please check back later.' });
  // next();
};

export default handleServerError;
