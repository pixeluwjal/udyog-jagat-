import nodemailer from 'nodemailer';

export const sendReferralEmail = async (to: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  const info = await transporter.sendMail({
    from: `"Udyog Jagat" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Your Referral Code',
    text: `Your referral code is: ${code}`,
    html: `<p>Your referral code is: <b>${code}</b></p>`,
  });

  return info;
};
