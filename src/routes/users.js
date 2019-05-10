import express from 'express';
import validateParams from '../middlewares/validate-params';
import User from '../controllers/user';
import UserAuth from '../middlewares/authorization';

const router = express.Router();

router.get('/:userEmailAddress/accounts', validateParams('email'), UserAuth.staffOnly, User.getUserAccounts);
router.get('/accounts', UserAuth.clientOnly, User.getMyAccounts);
router.get('/transactions', User.getMyTransactions);

export default router;
