import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import transaction from '../controllers/transaction';
import authorization from '../middlewares/authorization';

const router = express.Router();

router.post('/:accountNumber/debit', validateInputs('postTransaction'), authorization.basic, authorization.allowCashier, transaction.debitAccount);

router.post('/:accountNumber/credit', validateInputs('postTransaction'), authorization.basic, authorization.allowCashier, transaction.creditAccount);

router.get('/:id', validateParams('id'), authorization.basic, authorization.allowUser, transaction.getOneTransaction);

export default router;
