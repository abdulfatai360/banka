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
      return HttpResponse.send(res, 401, { error: 'You are not authorized to perform this operation' });
    }

    try {
      const decoded = AuthorizationToken.verifyToken(token);
      req.body.ownerId = String(decoded.id);
      return decoded;
    } catch (err) {
      return HttpResponse.send(res, 400, { error: 'Invalid authorization credentials to perform this operation' });
    }
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
    console.log(req.user)
    if (/^client$/i.test(req.user.type)) return next();

    return HttpResponse.send(res, 403, { error: 'Sorry, only a client can perform this operation.' });
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

    return HttpResponse.send(res, 403, { error: 'Sorry, only a staff can perform this operation.' });
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

    return HttpResponse.send(res, 403, { error: 'Sorry, only a cashier can perform this operation.' });
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

    return HttpResponse.send(res, 403, { error: 'Sorry, only an admin can perform this operation.' });
  }
}

export default UserAuthorization;
