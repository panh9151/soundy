import connection from "@/lib/connection";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import bcrypt from "bcryptjs";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";

export const PATCH = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser(request);
    const body = await request.json();
    const { oldPassword = "", newPassword = "" } = body;

    // Check required
    Checker.checkRequired(newPassword, oldPassword);

    // Check password format
    Checker.checkPassword(newPassword);
    Checker.checkPassword(oldPassword);

    // Compare new and old
    if (newPassword === oldPassword)
      throwCustomError("New password and old password are the same", 400);

    // Compare old password
    const match = await bcrypt.compare(oldPassword, currentUser.password);

    if (match) {
      // Encrypt the password
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update DB
      const query = `UPDATE User SET password = ? WHERE id_user = ?`;
      await connection.query(query, [hashedPassword, currentUser.id_user]);

      return objectResponse("Change password successfully", 200);
    } else {
      throwCustomError("Wrong old password", 400);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
