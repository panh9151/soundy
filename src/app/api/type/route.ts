import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request) => {
  try {
    const [typeList]: Array<any> = await connection.query(
      `SELECT * FROM Type`,
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
    const { label, thumbnail } = body;

    // Check required
    Checker.checkRequired(label);

    // Validation
    Checker.checkString(label);
    Checker.checkString(thumbnail);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Update DB
    const [result]: Array<any> = await connection.query(
      `CALL add_type(?, ?);`,
      [label, thumbnail]
    );
    const addedData = result[0][0];

    return objectResponse({ newID: addedData.id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
