import fs from 'fs';
import log from 'loglevel';
import nodemailer from 'nodemailer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const dkimKey = fs.readFileSync(path.join(__dirname, '../dkim/private.key'), { encoding: 'utf-8' });

const smtpTransport = {
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false, // Should be false for port 587 to fallback to STARTTLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PSWD,
  },
  requireTLS: true,
  tls: {
    // requireTls: true,
    ciphers: 'SSLv3'
  },
  dkim: {
    domainName: process.env.EMAIL_DOMAIN,
    keySelector: 'elementalzcash',
    privateKey: dkimKey,
  }
}

const transporter = nodemailer.createTransport(smtpTransport)

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Mail server is ready to send messages.");
  }
});

type SendEmailArgs = {
  subject: string,
  text: string,
  html?: string,
  from?: string,
  to: string,
  replyTo?: string;
};

export const sendEmail = async (args: SendEmailArgs) => {
  const from = args.from;
  const to = args.to;
  const subject = args.subject;
  const text = args.text;
  const html = args.html;
  const replyTo = args.replyTo;

  if (!from || !to || !subject || !text) {
    return null;
  }

  const message = {
    from,
    to,
    replyTo,
    subject,
    text,
    html,
  };

  try {
    await transporter.sendMail(message);
  } catch (err) {
    log.debug(err);
  }
  console.log('Sent')

  return true;
}
