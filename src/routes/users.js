import express from 'express';
import validateParams from '../middlewares/validate-params';
import User from '../controllers/user';
import UserAuth from '../middlewares/authorization';

const router = express.Router();

router.get(
  '/:userEmailAddress/accounts',
  validateParams('email'),
  UserAuth.staffOnly,
  User.getUserAccounts,
);

router.get('/accounts', UserAuth.clientOnly, User.getMyAccounts);

router.get(
  '/transactions',
  UserAuth.clientAndCashierOnly,
  User.getMyTransactions,
);

router.get(
  '/transactions/:accountNumber',
  UserAuth.clientOnly,
  User.getMySpecificAccountTransactions,
);

router.get(
  '/',
  UserAuth.adminOnly,
  User.getAllStaff,
);

export default router;
