import { render } from '@react-email/render';
import VerficationEmail from '../../emails/VerificationEmail';
import transporter from '../lib/nodemailer';

export async function sendEmail(toEmail: string, username: string, otp: string) {
  const emailHtml = await render(VerficationEmail({ username, otp }));

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "Verify your account",
    html: emailHtml, 
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send verification email." };
  }
}
