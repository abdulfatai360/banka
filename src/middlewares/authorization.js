import authToken from '../utilities/auth-token';
import HttpResponse from '../utilities/http-response';

const authorization = {
  basic(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
      return HttpResponse.send(res, 401, { error: 'You are not authorized to perform this operation' });
    }

    try {
      const decoded = authToken.verifyToken(token);
      req.user = decoded;
      req.body.ownerId = String(decoded.id);
    } catch (err) {
      return HttpResponse.send(res, 400, { error: 'You do not have the right credentials to perform this request' });
    }

    return next();
  },

  allowUser(req, res, next) {
    if (/^client$/i.test(req.user.type)) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only a client can perform this operation.' });
  },

  allowStaff(req, res, next) {
    if (/^staff$/i.test(req.user.type)) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only a staff can perform this operation.' });
  },

  allowCashier(req, res, next) {
    if (/^staff$/i.test(req.user.type) && !req.user.isAdmin) {
      req.body.cashierId = String(req.user.id);
      return next();
    }

    return HttpResponse.send(res, 403, { error: 'Sorry, only a cashier can perform this operation.' });
  },

  allowAdmin(req, res, next) {
    if (/^staff$/i.test(req.user.type) && req.user.isAdmin) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only an admin can perform this operation.' });
  },
};

export default authorization;
