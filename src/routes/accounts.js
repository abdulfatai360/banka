import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import account from '../controllers/account';

const router = express.Router();

router.post('/', validateInputs('createBankAccount'), account.createAccount);

router.patch('/:accountNumber', validateInputs('changeBankAccountStatus'), account.changeStatus);

router.delete('/:accountNumber', validateInputs('accountNumberParam'), account.deleteAccount);

router.get('/:accountNumber/transactions', validateInputs('accountNumberParam'), account.getAllTransactions);

export default router;
