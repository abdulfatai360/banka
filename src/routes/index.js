import root from './root';
import auth from './auth';
import users from './users';
import accounts from './accounts';
import tokens from './tokens';
import transactions from './transactions';
import undefinedRoute from './undefined';

/**
 * Mounts each routes on an express application instance
 * @param {object} app - Express application instance
 */
const mountRoutes = (app) => {
  app.use('/', root);
  app.use('/api/v1/auth', auth);
  app.use('/api/v1/user', users);
  app.use('/api/v1/accounts', accounts);
  app.use('/api/v1/tokens', tokens);
  app.use('/api/v1/transactions', transactions);
  app.use('/*', undefinedRoute);
};

export default mountRoutes;
