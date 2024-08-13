import connection from "@/lib/connection";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import bcrypt from "bcryptjs";
import Checker from "@/utils/Checker";

export const POST = async (
  request: Request,
  { params }: { params: { token: string } }
) => {
  try {
    const body = await request.json();
    const token = params.token;
    const { newPassword = "" } = body;

    // Check required and format new password
    Checker.checkRequired(newPassword);
    Checker.checkPassword(newPassword);

    // Check existing token and expired time
    const [users]: Array<any> = await connection.query(
      `select id_user, token_reset, expired_token_reset from User where token_reset = '${token}' and expired_token_reset > '${Date.now()}'`
    );

    if (users.length === 1) {
      const user = users[0];

      // Encrypt the password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update DB
      const query = `UPDATE User SET password = ?, token_reset = NULL, expired_token_reset = NULL WHERE id_user = ?`;
      await connection.query(query, [hashedPassword, user.id_user]);

      return objectResponse({ message: "Reset password successfully" }, 200);
    } else {
      throwCustomError("Reset token not found");
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
