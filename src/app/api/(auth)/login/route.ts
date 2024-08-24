import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import Checker from "@/utils/Checker";
import connection from "@/lib/connection";
import bcrypt from "bcryptjs";
import { objectResponse } from "@/utils/Response";
import { SignJWT } from "jose";
import Env from "@/utils/Env";

const secretToken = Env.ACCESS_TOKEN_SECRET;

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { email = "", password = "" }: { email: string; password: string } =
      body;

    // Check required
    Checker.checkRequired(email, password);

    // Check validate
    Checker.checkEmail(email);
    Checker.checkPassword(password);

    // Get user
    let [rows]: Array<any> = await connection.query(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );
    if (rows.length !== 1) throwCustomError("Invalid credentials", 401);
    const user = rows[0];

    // Check banned user
    if (user.is_banned === "1") throwCustomError("Not enough permission", 403);

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const accessToken = await new SignJWT({ id: user.id_user })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("10000h")
        // .setExpirationTime("24h")
        .sign(secretToken);

      return objectResponse(
        { accessToken: accessToken, message: "Success" },
        200
      );
    } else {
      return objectResponse({ message: "Invalid credentials" }, 401);
    }
  } catch (e: any) {
    return getServerErrorMsg(e);
  }
};
