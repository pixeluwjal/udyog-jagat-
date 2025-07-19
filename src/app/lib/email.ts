import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  name: string;
  role: string;
  code: string;
}

// Configure your email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendApprovalEmail(options: EmailOptions) {
  const { to, name, role, code } = options;
  
  // Determine the role-specific message
  const roleMessage = {
    job_seeker: "start applying for jobs",
    recruiter: "begin recruiting talent",
    referrer: "start referring candidates"
  }[role] || "use our platform";

  const signupLink = `${process.env.NEXT_PUBLIC_SITE_URL}/signup?referral=${code}`;

  const mailOptions = {
    from: `"Your Company" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
    to,
    subject: "Your Referral Approval",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to Our Platform!</h2>
        <p>Hello ${name},</p>
        <p>Your request to join as a ${role.replace('_', ' ')} has been approved.</p>
        <p>Here's your unique referral code: <strong>${code}</strong></p>
        <p>Use this link to complete your registration:</p>
        <a href="${signupLink}" 
           style="display: inline-block; background-color: #2563eb; color: white; 
                  padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 15px 0;">
          Complete Registration
        </a>
        <p>Or copy and paste this URL into your browser:</p>
        <p style="word-break: break-all;">${signupLink}</p>
        <p>This code will expire in 30 days.</p>
        <p>Best regards,<br/>The Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
}