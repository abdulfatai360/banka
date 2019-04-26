import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import winston from 'winston';

dotenv.config({ path: '../../.env' });

const transportConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAILER_EMAIL_ID,
    pass: process.env.MAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transportConfig);

const sendEmail = (to = {}, subject = '', message = '') => {
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
};

export default sendEmail;
