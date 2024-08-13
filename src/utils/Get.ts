import connection from "@/lib/connection";
import { throwCustomError } from "./Error";

export const getUserbyId = async (idUser: string) => {
  const [rows]: Array<any> = await connection.query(
    "SELECT * FROM User WHERE id_user = ?",
    [idUser]
  );

  const user = rows[0];

  if (rows.length === 0) {
    return "User not found";
  } else {
    return user;
  }
};

export const getCurrentUser = async (
  req: Request,
  isRequired: boolean = true
) => {
  const userId = req.headers.get("userId") || "";
  if (!userId) throwCustomError("Auth middleware not handle!", 500);

  const user = getUserbyId(userId);

  if (isRequired) {
    if (typeof user === "string") throwCustomError("Authenticate user failed");
    return user;
  } else {
    return user;
  }
};
