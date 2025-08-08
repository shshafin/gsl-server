import nodemailer from 'nodemailer';
import config from '../config';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

const transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: Number(config.smtp_port),
  secure: config.smtp_secure === 'true',
  auth: {
    user: config.smtp_user,
    pass: config.smtp_pass,
  },
});

export const sendEmail = async (options: EmailOptions) => {
  const mailOptions = {
    from: `"Cash Tracker" <${config.smtp_user}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html, // optional
  };

  await transporter.sendMail(mailOptions);
};
