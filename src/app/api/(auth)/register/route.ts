import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import Checker from "@/utils/Checker";
import connection from "@/lib/connection";
import bcrypt from "bcryptjs";
import { objectResponse } from "@/utils/Response";
import { randomUUID } from "crypto";

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const {
      first_name = "",
      last_name = "",
      middle_name = "",
      email = "",
      password = "",
    }: {
      first_name: string;
      last_name: string;
      middle_name: string;
      email: string;
      password: string;
    } = body;

    // Check required
    Checker.checkRequired(first_name, last_name, email, password);

    // Validation
    Checker.checkString(first_name);
    Checker.checkString(middle_name);
    Checker.checkString(last_name);
    Checker.checkPassword(password);
    Checker.checkEmail(email);

    // Check existing user
    const [users]: Array<any> = await connection.query(
      "select id_user from User where email = ?",
      [email]
    );
    if (users.length === 0) {
      // Define id and hashedPassword
      const newId = randomUUID();
      const hashedPassword = await bcrypt.hash(password, 12);

      // Add new user to DB
      const query = `insert into User(id_user, first_name, middle_name, last_name, email, password) value (?, ?, ?, ?, ?, ?)`;
      const queryFields = [
        newId,
        first_name,
        middle_name,
        last_name,
        email,
        hashedPassword,
      ];
      await connection.query(query, queryFields);

      return objectResponse({ message: "Add user successfully" }, 201);
    } else {
      throwCustomError("Email is already exist", 409);
    }
  } catch (e: any) {
    return getServerErrorMsg(e);
  }
};
