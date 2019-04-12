// import nodemailer from 'nodemailer';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

// using test email account from Ethereal
/* const transportConfig = {
  host: 'smtp.ethereal.email',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'lillian.schaden36@ethereal.email', // generated ethereal user
    pass: 'bvaPSfUvNMVXHkfXPm', // generated ethereal password
  },
}; */

const transportConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use SSL
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
    if (err) console.log(err.message);

    console.log(`Message sent: ${info.response}`);
  });
};

export default sendEmail;
