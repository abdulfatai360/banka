import express from 'express';
import User from '../controllers/user';
import validateInputs from '../middlewares/validate-inputs';

const router = express.Router();

router.post('/signup', validateInputs('createUser'), User.createUser);
router.post('/signin', User.loginUser);

export default router;
