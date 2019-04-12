import txnAlertTemplate from './email-assets/txn-alert';

class EmailTemplates {
  constructor() {
    this.txnAlertTemplate = txnAlertTemplate;
  }

  getTxnAlertTemplate() {
    return this.txnAlertTemplate;
  }
}

export default EmailTemplates;
