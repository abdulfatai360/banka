import express from 'express';
import validateParams from '../middlewares/validate-params';
import user from '../controllers/user';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.get('/:userEmailAddress/accounts', validateParams('email'), authorization.basic, authorization.allowStaff, user.getMyAccounts);

export default router;
