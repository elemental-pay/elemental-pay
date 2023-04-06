
// HTML template guide:
// https://app.postdrop.io/
// Centralise around Postmark API or nodemailer API?

import { APP_URL } from '../config';
import { sendEmail } from '../elemental-mail';

export const sendVerificationEmail = async (address: string, token: string) => {
  await sendEmail({
    to: address,
    text: `Verify your account with the token: ${APP_URL}/auth/verify-email?token=${token}`,
    subject: 'Test email verification email',
    from: process.env.NO_REPLY_FROM_ADDRESS,
  });

  console.log('Success');
}

// ReactDOMServer.renderToStaticMarkup