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

    // Truy vấn người dùng từ cơ sở dữ liệu dựa trên email
    let [rows]: Array<any> = await connection.query(
      "SELECT * FROM User WHERE email = ?",
      [email]
    );

    // Check not found
    if (rows.length !== 1) throwCustomError("Invalid credentials", 404);

    const user = rows[0];

    // compare password
    // const hashedPassword = await bcrypt.hash(password, 12);
    const match = await bcrypt.compare(password, user.password);

    // Check password situations
    if (match) {
      // Tạo token JWT

      const accessToken = await new SignJWT({ id: user.id_user })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("24h")
        .sign(secretToken);

      return objectResponse({ accessToken }, 200);
    } else {
      return objectResponse({ message: "Invalid credentials" }, 400);
    }
  } catch (e: any) {
    return getServerErrorMsg(e);
  }
};
