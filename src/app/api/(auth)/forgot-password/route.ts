import connection from "@/lib/connection";
import transporter from "@/lib/transporter";
import Checker from "@/utils/Checker";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import crypto from "crypto";
import { headers } from "next/headers";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email = "" } = body;

    // Check missing
    Checker.checkRequired(email);

    // Validate
    Checker.checkEmail(email);

    // Check existing user and get user
    const [users]: Array<any> = await connection.query(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );
    if (users.length === 0) {
      throwCustomError("User not found", 400);
    }
    const user = users[0];

    // Create crypto code
    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpireTime = Date.now() + 300000; // Expired in 5 minutes

    // Update DB
    await connection.query(
      "UPDATE User SET token_reset = ?, expired_token_reset = ? WHERE id_user = ?",
      [resetToken, tokenExpireTime, user.id_user]
    );

    const url = headers().get("host") || "";
    const resetLink = `https://${url}/reset-password/${resetToken}`;

    // Send email
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}`,
    });

    // Trả về phản hồi thành công
    return objectResponse(
      {
        message: "Password reset email sent successfully.",
      },
      200
    );
  } catch (error) {
    // Xử lý lỗi
    return getServerErrorMsg(error);
  }
};
