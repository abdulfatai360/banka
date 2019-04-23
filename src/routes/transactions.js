import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import transaction from '../controllers/transaction';

const router = express.Router();

router.post('/:accountNumber/debit', validateInputs('postTransaction'), transaction.debitAccount);

router.post('/:accountNumber/credit', validateInputs('postTransaction'), transaction.creditAccount);

router.get('/:id', validateParams('id'), transaction.getOneTransaction);

export default router;
