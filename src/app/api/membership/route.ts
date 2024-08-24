import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser(request, true);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    const [typeList]: Array<any> = await connection.query(
      `SELECT * FROM Membership`,
      []
    );
    return objectResponse([...typeList]);
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { start, end, price, payment_method } = body;

    // Check required
    Checker.checkRequired(start, end, price, payment_method);

    // Validation
    Checker.checkDate(start);
    Checker.checkDate(end);
    Checker.checkNumber(price);
    Checker.checkString(payment_method);
    // Checker.checkIncluded(is_paid, ["paid", "unpaid", "returned"]);

    // Check permission
    const currentUser = await getCurrentUser(request, true);

    // Update DB
    const [result]: Array<any> = await connection.query(
      `CALL add_period_membership(?, ?, ?, ?, ?);`,
      [currentUser.id_user, start, end, price, payment_method]
    );
    const addedData = result[0][0];

    return objectResponse({ newID: addedData.id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
