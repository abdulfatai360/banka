import express from 'express';
import validateInputs from '../middlewares/validate-inputs';
import validateParams from '../middlewares/validate-params';
import transaction from '../controllers/transaction';
import authorization from '../middlewares/authorization';

const router = express.Router();
router.use(authorization.allowUser);

router.post('/:accountNumber/debit', authorization.allowCashier, validateInputs('postTransaction'), transaction.debitAccount);

router.post('/:accountNumber/credit', authorization.allowCashier, validateInputs('postTransaction'), transaction.creditAccount);

router.get('/:id', validateParams('id'), transaction.getOneTransaction);

export default router;
