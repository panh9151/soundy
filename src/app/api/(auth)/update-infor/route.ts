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
    const {
      first_name,
      middle_name,
      last_name,
      avatar_path,
      phone,
      gender,
      age,
    } = body;

    // Check required
    Checker.checkRequired(first_name, last_name);

    // Check password format
    Checker.checkString(first_name);
    Checker.checkString(middle_name);
    Checker.checkString(last_name);
    Checker.checkString(avatar_path);
    Checker.checkPhoneNumber(phone);
    Checker.checkGender(gender);
    Checker.checkInteger(age);

    // Update DB
    const updateData = [
      first_name,
      middle_name,
      last_name,
      avatar_path,
      phone,
      gender,
      age,
    ];
    const query = `UPDATE User SET ${[
      "first_name",
      "middle_name",
      "last_name",
      "avatar_path",
      "phone",
      "gender",
      "age",
    ].join(" = ?, ")} = ? WHERE id_user = ?`;
    await connection.query(query, [...updateData, currentUser.id_user]);

    return objectResponse(
      { message: "Update user information successfully" },
      200
    );
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
