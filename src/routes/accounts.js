import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import account from '../controllers/account';

const router = express.Router();

router.post('/', validateInputs('createBankAccount'), account.createAccount);
router.patch('/:accountNumber', validateInputs('changeBankAccountStatus'), account.changeStatus);
router.delete('/:accountNumber', validateInputs('deleteBankAccount'), account.delete);

export default router;
