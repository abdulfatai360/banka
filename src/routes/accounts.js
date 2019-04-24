import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import account from '../controllers/account';
import authorization from '../middlewares/authorization';

const router = express.Router();
router.use(authorization.allowUser);

router.post('/', validateInputs('createAccount'), account.createAccount);

router.patch('/:accountNumber', authorization.allowAdmin, validateInputs('changeAccountStatus'), account.changeStatus);

router.delete('/:accountNumber', authorization.allowStaff, validateParams('accountNumber'), account.deleteAccount);

router.get('/:accountNumber/transactions', validateParams('accountNumber'), account.getAllTransactions);

router.get('/:accountNumber', validateParams('accountNumber'), account.getSpecificAccount);

router.get('/', authorization.allowStaff, account.getAllAccounts);

export default router;
