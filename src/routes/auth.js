import '@babel/polyfill';
import express from 'express';
import user from '../controllers/user';
import validateInputs from '../middlewares/validate-inputs';

const router = express.Router();

router.post('/signup', validateInputs('createUser'), user.create);
router.post('/signin', validateInputs('loginUser'), user.login);

export default router;
