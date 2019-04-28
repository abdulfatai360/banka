// import EmailTemplates from './email-templates';
// import padWithZero from './zero-padding';
// import emailSender from '../utilities/email-sender';


// const emailTemplate = new EmailTemplates().getTxnAlertTemplate();

// const generateEmailContent = (txnAlertTemplate, txnInfo, account) => {
//   let template = txnAlertTemplate;

//   const txnTimeDate = txnInfo.createdOn;
//   const accountName = userModel.getFullName(Number(account.owner));

//   const txnDate = `${padWithZero(txnTimeDate.getDate())}/${padWithZero(txnTimeDate.getMonth() + 1)}/${txnTimeDate.getFullYear()}`;

//   const txnTime = `${padWithZero(txnTimeDate.getHours())}:${padWithZero(txnTimeDate.getMinutes())}`;

//   template = template.replace('{{accountName}}', accountName);
//   template = template.replace('{{type}}', txnInfo.transactionType);
//   template = template.replace('{{accountNumber}}', txnInfo.accountNumber);
//   template = template.replace('{{amount}}', convertTo2dp(txnInfo.amount));
//   template = template.replace('{{date}}', txnDate);
//   template = template.replace('{{time}}', txnTime);
//   template = template.replace('{{currentBal}}', convertTo2dp(txnInfo.accountBalance));

//   return template;
// };

// return emailSender({
//   name: userModel.getFullName(Number(account.owner)),
//   address: userModel.findById(Number(account.owner)).email,
// }, 'Banka Transaction Alert', txnAlertTemplate);

// const txnAlertTemplate = generateEmailContent(emailTemplate, txnInfo, account);

// const txnAlertTemplate = generateEmailContent(emailTemplate, txnInfo, account);

// return emailSender({
//   name: userModel.getFullName(Number(account.owner)),
//   address: userModel.findById(Number(account.owner)).email,
// }, 'Banka Transaction Alert', txnAlertTemplate);
