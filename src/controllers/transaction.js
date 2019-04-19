import { transactionModel } from '../models/transaction';
import { accountModel } from '../models/account';
import convertTo2dp from '../utilities/convert-to-2dp';
import { userModel } from '../models/user';
import HttpResponse from '../utilities/http-response';
import EmailTemplates from '../utilities/email-templates';
import emailSender from '../utilities/email-sender';
import padWithZero from '../utilities/zero-padding';

const emailTemplate = new EmailTemplates().getTxnAlertTemplate();

const txnInit = (req) => {
  const { accountNumber } = req.params;

  const account = accountModel.findByAccountNumber(accountNumber);
  const cashier = userModel.findCashierById(Number(req.body.cashier));

  return { account, cashier };
};

const saveAndReturnTxnEntity = (req, res, oldBalance, account) => {
  const transactionData = {
    type: req.body.type,
    accountNumber: req.params.accountNumber,
    cashier: Number(req.body.cashier),
    amount: convertTo2dp(req.body.amount),
    oldBalance: convertTo2dp(oldBalance),
    newBalance: convertTo2dp(account.balance),
  };

  const txnInfo = transactionModel.create(transactionData);

  HttpResponse.send(res, 201, { data: txnInfo });
  return txnInfo;
};

const generateEmailContent = (txnAlertTemplate, txnInfo, account) => {
  let template = txnAlertTemplate;

  const txnTimeDate = txnInfo.createdOn;
  const accountName = userModel.getFullName(Number(account.owner));

  const txnDate = `${padWithZero(txnTimeDate.getDate())}/${padWithZero(txnTimeDate.getMonth() + 1)}/${txnTimeDate.getFullYear()}`;

  const txnTime = `${padWithZero(txnTimeDate.getHours())}:${padWithZero(txnTimeDate.getMinutes())}`;

  template = template.replace('{{accountName}}', accountName);
  template = template.replace('{{type}}', txnInfo.transactionType);
  template = template.replace('{{accountNumber}}', txnInfo.accountNumber);
  template = template.replace('{{amount}}', convertTo2dp(txnInfo.amount));
  template = template.replace('{{date}}', txnDate);
  template = template.replace('{{time}}', txnTime);
  template = template.replace('{{currentBal}}', convertTo2dp(txnInfo.accountBalance));

  return template;
};

const transactionController = {
  debitAccount(req, res) {
    const init = txnInit(req);

    if (!init.cashier) {
      return HttpResponse.send(res, 400, {
        error: 'The cashier value you entered is incorrect',
      });
    }

    if (!init.account) {
      return HttpResponse.send(res, 400, {
        error: 'The account you wanted to debit is incorrect',
      });
    }

    const { account } = init;
    const oldBalance = account.balance;
    const newBal = Number(account.balance) - Number(req.body.amount);

    if (newBal < 0) {
      return HttpResponse.send(res, 400, {
        error: 'Insufficient fund to complete this transaction',
      });
    }

    account.balance = convertTo2dp(newBal);
    const txnInfo = saveAndReturnTxnEntity(req, res, oldBalance, account);
    const txnAlertTemplate = generateEmailContent(emailTemplate, txnInfo, account);

    return emailSender({
      name: userModel.getFullName(Number(account.owner)),
      address: userModel.findById(Number(account.owner)).email,
    }, 'Banka Transaction Alert', txnAlertTemplate);
  },

  creditAccount(req, res) {
    const init = txnInit(req);

    if (!init.cashier) {
      return HttpResponse.send(res, 400, {
        error: 'The cashier value you entered is incorrect',
      });
    }

    if (!init.account) {
      return HttpResponse.send(res, 400, {
        error: 'The account you wanted to credit is incorrect',
      });
    }

    const { account } = init;
    const oldBalance = account.balance;

    account.balance = convertTo2dp(Number(account.balance) + Number(req.body.amount));
    const txnInfo = saveAndReturnTxnEntity(req, res, oldBalance, account);

    const txnAlertTemplate = generateEmailContent(emailTemplate, txnInfo, account);

    return emailSender({
      name: userModel.getFullName(Number(account.owner)),
      address: userModel.findById(Number(account.owner)).email,
    }, 'Banka Transaction Alert', txnAlertTemplate);
  },
};

export default transactionController;
