import authToken from '../utilities/auth-token';
import HttpResponse from '../utilities/http-response';

const authorization = {
  allowUser(req, res, next) {
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

  allowStaff(req, res, next) {
    console.log(req.user);

    if (!/^staff$/i.test(req.user.type)) {
      return HttpResponse.send(res, 403, { error: 'You do not have the right access route. Only a staff member can perform this operation.' });
    }

    return next();
  },

  allowCashier(req, res, next) {
    if (!/^staff$/i.test(req.user.type) && req.user.isAdmin) {
      return HttpResponse.send(res, 403, { error: 'You do not have the right access to this route. Only a cashier can perform this operation.' });
    }

    req.body.cashierId = String(req.user.id);
    console.log(req.body.cashierId);

    return next();
  },

  allowAdmin(req, res, next) {
    if (!req.user.isAdmin) {
      return HttpResponse.send(res, 403, { error: 'You do not have the right access to this endpoint. Only an admin can perform this operation.' });
    }

    return next();
  },
};

export default authorization;
