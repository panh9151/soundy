import connection from "@/lib/connection";
import { throwCustomError } from "./Error";

export const getUserbyId = async (idUser: string) => {
  const [rows]: Array<any> = await connection.query(
    `
    SELECT
        u.id_user,
        u.first_name,
        u.last_name,
        u.middle_name,
        u.role,
        u.email,
        u.avatar_path,
        u.phone,
        u.gender,
        u.age,
        u.id_google,
        u.is_banned,
        u.last_updated,
        u.created_date,
        CASE
            WHEN u.role = 'admin' THEN 'admin'
            WHEN u.role = 'user' AND pm.id_membership IS NOT NULL AND NOW() BETWEEN pm.start AND pm.end AND pm.is_paid = 'paid' THEN 'membership'
            WHEN u.role = 'user' THEN 'user'
        END AS role
    FROM
        User u
    LEFT JOIN
        PeriodMembership pm ON u.id_user = pm.id_user
        AND NOW() BETWEEN pm.start AND pm.end
        AND pm.is_paid = 'paid'
    WHERE u.id_user = ?;
    `,
    [idUser]
  );

  if (rows.length === 0) return "User not found";
  const user = rows[0];
  if (user.is_banned === "1") return "Cannot verify authentication";
  return user;
};

export const getCurrentUser = async (
  req: Request,
  isRequired: boolean = true
) => {
  const userId = req.headers.get("userId") || "";

  const user = getUserbyId(userId);

  if (isRequired) {
    if (!userId) throwCustomError("Auth middleware not handle!", 500);
    if (typeof user === "string") throwCustomError("Authenticate user failed");
    return user;
  } else {
    return user;
  }
};
