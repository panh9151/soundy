import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import { getCurrentUser } from "@/utils/Get";
import Env from "@/utils/Env";
import { filterObjectKeys } from "@/utils/Object";
import Fields from "@/utils/Fields";

export const GET = async (req: Request) => {
  try {
    // Get current user
    const user = await getCurrentUser(req);
    if (user.is_banned === "1" && user.role !== "1")
      throwCustomError("User not found");

    return objectResponse(
      { data: filterObjectKeys(user, Fields.user(user.role) as Array<any>) },
      200
    );
  } catch (e: any) {
    return getServerErrorMsg(e);
  }
};
