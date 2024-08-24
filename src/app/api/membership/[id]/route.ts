import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request, context: any) => {
  try {
    const currentUser = await getCurrentUser(request, true);
    const { params } = context;
    const { id } = params;
    if (currentUser?.role !== "admin" && currentUser.id_user !== id)
      throwCustomError("Not enough permission", 403);

    const [result]: any[] = await connection.query(
      `SELECT * FROM Type WHERE id_type = ?`,
      [id]
    );

    return objectResponse([...result]);
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const PATCH = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const { newStatus } = body;
    const { params } = context;
    const { id } = params;

    // Check required field
    Checker.checkRequired(id, newStatus);

    // Validation
    Checker.checkIncluded(newStatus, ["paid", "unpaid", "returned"]);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin" && currentUser?.id_user === id)
      throwCustomError("Not enough permission", 403);

    // Check existing ID
    const [rows]: any[] = await connection.query(
      `SELECT id_membership from PeriodMembership where id_membership = ?`,
      [id]
    );
    if (rows.length === 0) throwCustomError("ID not found");

    // Build SQL query for update
    const query = `UPDATE PeriodMembership SET is_paid = ? WHERE id_membership = ?`;

    // Execute the update query
    await connection.query(query, [newStatus, id]);

    return objectResponse({ message: "updated" });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
