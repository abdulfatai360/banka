import express from 'express';
import user from '../controllers/user';
import validateInputs from '../middlewares/validate-inputs';

const router = express.Router();

router.post('/signup', validateInputs('createUser'), user.createUser);
router.post('/signin', validateInputs('loginUser'), user.loginUser);

export default router;
