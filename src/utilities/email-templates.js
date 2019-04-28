import txnAlertTemplate from './email-assets/transaction';

class EmailTemplates {
  constructor() {
    this.txnAlertTemplate = txnAlertTemplate;
  }

  getTxnAlertTemplate() {
    return this.txnAlertTemplate;
  }
}

export default EmailTemplates;
