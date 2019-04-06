import '@babel/polyfill';
import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import account from '../controllers/account';

const router = express.Router();

router.post('/', validateInputs('createBankAccount'), account.create);
router.patch('/:accountNumber', validateInputs('changeBankAccountStatus'), account.changeStatus);

export default router;
