import AuthorizationToken from '../utilities/auth-token';
import HttpResponse from '../utilities/http-response';

/**
 * Contains methods for authorizing different user types on protected routes
 *
 * @class UserAuthorization
 */
class UserAuthorization {
  /**
   * Verifies the client making a request has right credentials and returns its details
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @returns
   * @memberof UserAuthorization
   */
  static getLoggedInUser(req, res) {
    const token = req.header('x-auth-token');

    if (!token) {
      return HttpResponse.send(res, 401, { error: 'Please signup or login to your account' });
    }

    const decoded = AuthorizationToken.verifyToken(token);
    req.body.ownerId = String(decoded.id);
    return decoded;
  }

  /**
   * Authorizes only client user type to access a protected route
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function that passes control to the next middleware
   * @returns
   * @memberof UserAuthorization
   */
  static clientOnly(req, res, next) {
    req.user = UserAuthorization.getLoggedInUser(req, res);
    if (/^client$/i.test(req.user.type)) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only a client can access this feature.' });
  }

  static clientAndCashierOnly(req, res, next) {
    req.user = UserAuthorization.getLoggedInUser(req, res);
    if (/^client$/i.test(req.user.type) || (/^staff$/i.test(req.user.type) && !req.user.isAdmin)) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only a client or cashier can access this feature.' });
  }

  /**
   * Authorizes both cashier and admin user type to access a protected route
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function that passes control to the next middleware
   * @returns
   * @memberof UserAuthorization
   */
  static staffOnly(req, res, next) {
    req.user = UserAuthorization.getLoggedInUser(req, res);
    if (/^staff$/i.test(req.user.type)) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only a staff can access this feature.' });
  }

  /**
   * Authorizes only cashier user type to access a protected route
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function that passes control to the next middleware
   * @returns
   * @memberof UserAuthorization
   */
  static cashierOnly(req, res, next) {
    req.user = UserAuthorization.getLoggedInUser(req, res);
    if (/^staff$/i.test(req.user.type) && !req.user.isAdmin) {
      req.body.cashierId = String(req.user.id);
      return next();
    }

    return HttpResponse.send(res, 403, { error: 'Sorry, only a cashier can access this feature.' });
  }

  /**
   * Authorizes only admin user type to access a protected route
   *
   * @static
   * @param {object} req - HTTP request object
   * @param {object} res - HTTP response object
   * @param {function} next - Express function that passes control to the next middleware
   * @returns
   * @memberof UserAuthorization
   */
  static adminOnly(req, res, next) {
    req.user = UserAuthorization.getLoggedInUser(req, res);
    if (/^staff$/i.test(req.user.type) && req.user.isAdmin) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only an admin can access this feature.' });
  }
}

export default UserAuthorization;
