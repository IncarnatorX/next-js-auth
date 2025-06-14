import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

type SendMailProps = {
  emailAddress: string;
  emailType: "VERIFY" | "RESET PASSWORD";
  userId: string;
};

export async function sendMail({
  emailAddress,
  emailType,
  userId,
}: SendMailProps) {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET PASSWORD") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    const transport = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST!,
      port: Number(process.env.MAILTRAP_PORT)!,
      auth: {
        user: process.env.MAILTRAP_USER!,
        pass: process.env.MAILTRAP_PASS!,
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL!,
      to: emailAddress,
      subject:
        emailType === "VERIFY" ? "Verify Your Account" : "Reset your password",
      html: `
          <p>Dear User,</p>
          <p>Click to <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verify-email" : "reset-password"
      }?token=${hashedToken}">here</a> 
          to ${
            emailType === "VERIFY"
              ? "verify your email address"
              : "reset your password."
          }
          </p>
          <p>Warm regards,</p>
          <p>The verification team</p>
          `,
    };

    await transport.sendMail(mailOptions);
  } catch (error) {
    console.error("ERROR in sendMail function: ", error);
  }
}
