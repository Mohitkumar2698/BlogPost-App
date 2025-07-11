import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  secure: true,
  service: "gmail",
  auth: {
    user: process.env.SMTP_MAIL,
    pass: process.env.SMTP_PASS,
  },
});

export const sendWelcomeEmail = async (to, name) => {
  const link = `${process.env.FRONTEND_URI}`;
  const mailOptions = {
    from: `"Team BlogStory👋" <${process.env.SMTP_MAIL}>`,
    to,
    subject: `Welcome, ${name}! Confirm your Email`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2 style="color: #4CAF50;">Welcome to BlogStory, ${name}!</h2>
        <p>Thank you for joining Us. Please click the button below to visit BlogStory:</p>
        <a href="${link}" style="display:inline-block;margin:20px 0;padding:10px 20px;background-color:#4CAF50;color:#fff;text-decoration:none;border-radius:5px;">Visit us</a>
        <p>If you did not sign up, you can ignore this email.</p>
        <br />
        <p style="font-size: 14px; color: #999;">~ The BlogStory Team</p>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};
