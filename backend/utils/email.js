const { Resend } = require('resend');

// Initialize Resend only if API key is available
let resend = null;
if (process.env.EMAIL_SERVICE_KEY) {
  resend = new Resend(process.env.EMAIL_SERVICE_KEY);
}

const sendOTPEmail = async (email, otp) => {
  try {
    if (!resend || !process.env.EMAIL_SERVICE_KEY) {
      console.log('⚠️  EMAIL_SERVICE_KEY not set. OTP would be sent:', otp);
      return { success: true, mockOTP: otp };
    }

    const data = await resend.emails.send({
      from: 'CyberNet AI <onboarding@resend.dev>',
      to: email,
      subject: 'CyberNet AI - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #000; color: #0ff;">
          <h1 style="color: #0ff; text-align: center; border-bottom: 2px solid #0ff; padding-bottom: 10px;">CyberNet AI</h1>
          <h2 style="color: #fff;">Email Verification</h2>
          <p style="color: #ccc; font-size: 16px;">Your verification code is:</p>
          <div style="background-color: #111; border: 2px solid #0ff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0ff; font-size: 36px; letter-spacing: 8px; margin: 0;">${otp}</h1>
          </div>
          <p style="color: #ccc;">This code will expire in 10 minutes.</p>
          <p style="color: #888; font-size: 14px; margin-top: 30px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `
    });

    return { success: true, data };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };