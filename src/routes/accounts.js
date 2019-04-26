import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import Account from '../controllers/account';
import UserAuth from '../middlewares/authorization';

const router = express.Router();

router.post('/', validateInputs('createAccount'), UserAuth.clientOnly, Account.createAccount);

router.patch('/:accountNumber', validateInputs('changeAccountStatus'), UserAuth.adminOnly, Account.changeStatus);

router.delete('/:accountNumber', validateParams('accountNumber'), UserAuth.staffOnly, Account.deleteAccount);

router.get('/:accountNumber/transactions', validateParams('accountNumber'), UserAuth.clientOnly, Account.getAllTransactions);

router.get('/:accountNumber', validateParams('accountNumber'), UserAuth.clientOnly, Account.getSpecificAccount);

router.get('/', UserAuth.staffOnly, Account.getAllAccounts);

export default router;
