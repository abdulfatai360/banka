import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import Transaction from '../controllers/transaction';
import UserAuth from '../middlewares/authorization';

const router = express.Router();

router.post('/:accountNumber/debit', validateInputs('postTransaction'), UserAuth.cashierOnly, Transaction.debitAccount);

router.post('/:accountNumber/credit', validateInputs('postTransaction'), UserAuth.cashierOnly, Transaction.creditAccount);

router.get('/:id', validateParams('id'), UserAuth.clientOnly, Transaction.getOneTransaction);

export default router;
