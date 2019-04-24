import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import account from '../controllers/account';

const router = express.Router();

router.post('/', validateInputs('createAccount'), account.createAccount);

router.patch('/:accountNumber', validateInputs('changeAccountStatus'), account.changeStatus);

router.delete('/:accountNumber', validateParams('accountNumber'), account.deleteAccount);

router.get('/:accountNumber/transactions', validateParams('accountNumber'), account.getAllTransactions);

router.get('/:accountNumber', validateParams('accountNumber'), account.getSpecificAccount);

router.get('/', account.getAllAccounts);

export default router;
