import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import winston from 'winston';
import transactionHtml from './email-assets/transaction-html';
import padWithZero from './zero-padding';

dotenv.config({ path: '../../.env' });

const emailTransportConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
};

class EmailServices {
  static generateTransactionAlert(transactionInfo = {}, accountName = '') {
    let transactionEmailContent = transactionHtml;

    const transactionTimeAndDate = transactionInfo.createdOn;
    const transactionDate = `${padWithZero(transactionTimeAndDate.getDate())}/${padWithZero(transactionTimeAndDate.getMonth() + 1)}/${transactionTimeAndDate.getFullYear()}`;
    const transactionTime = `${padWithZero(transactionTimeAndDate.getHours())}:${padWithZero(transactionTimeAndDate.getMinutes())}`;

    transactionEmailContent = transactionEmailContent.replace('{{accountName}}', accountName);
    transactionEmailContent = transactionEmailContent.replace('{{type}}', transactionInfo.transactionType);
    transactionEmailContent = transactionEmailContent.replace('{{accountNumber}}', transactionInfo.accountNumber);
    transactionEmailContent = transactionEmailContent.replace('{{amount}}', transactionInfo.amount);
    transactionEmailContent = transactionEmailContent.replace('{{date}}', transactionDate);
    transactionEmailContent = transactionEmailContent.replace('{{time}}', transactionTime);
    transactionEmailContent = transactionEmailContent.replace('{{currentBal}}', transactionInfo.newBalance);

    return transactionEmailContent;
  }

  static sendEmail(to = {}, subject = '', message = '') {
    const transporter = nodemailer.createTransport(emailTransportConfig);
    const mailOptions = {
      from: {
        name: 'Banka Nigeria',
        address: process.env.MAILER_EMAIL_ID,
      },
      to,
      subject,
      html: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) winston.error(err.message);
      winston.info(`Message sent: ${info.response}`);
    });
  }
}

export default EmailServices;
