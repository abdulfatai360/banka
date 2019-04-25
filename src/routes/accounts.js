import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import account from '../controllers/account';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.post('/', validateInputs('createAccount'), authorization.basic, authorization.allowUser, account.createAccount);

router.patch('/:accountNumber', validateInputs('changeAccountStatus'), authorization.basic, authorization.allowAdmin, account.changeStatus);

router.delete('/:accountNumber', authorization.basic, authorization.allowStaff, validateParams('accountNumber'), account.deleteAccount);

router.get('/:accountNumber/transactions', validateParams('accountNumber'), authorization.basic, authorization.allowUser, account.getAllTransactions);

router.get('/:accountNumber', validateParams('accountNumber'), authorization.basic, authorization.allowUser, account.getSpecificAccount);

router.get('/', authorization.basic, authorization.allowStaff, account.getAllAccounts);

export default router;
