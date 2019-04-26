import express from 'express';
import validateParams from '../middlewares/validate-params';
import User from '../controllers/user';
import UserAuth from '../middlewares/authorization';

const router = express.Router();

router.get('/:userEmailAddress/accounts', validateParams('email'), UserAuth.staffOnly, User.getMyAccounts);

export default router;
