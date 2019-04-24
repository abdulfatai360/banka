import express from 'express';
import validateParams from '../middlewares/validate-params';
import user from '../controllers/user';

const router = express.Router();

router.get('/:userEmailAddress/accounts', validateParams('email'), user.getMyAccounts);

export default router;
