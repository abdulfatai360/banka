import winston from 'winston';
import HttpResponse from '../utilities/http-response';

const handleServerError = (error, req, res, next) => {
  winston.error(error.message);
  return HttpResponse.send(res, 500, { error: 'Sorry, something went wrong. Please check back later.' });
  // next();
};

export default handleServerError;
