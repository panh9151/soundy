import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request, context: any) => {
  try {
    const currentUser = await getCurrentUser(request, false);
    const { params } = context;
    const { id } = params;

    const [result]: any[] = await connection.query(
      `SELECT * FROM Type WHERE id_type = ?`,
      [id]
    );

    return objectResponse({ data: result[0] });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const PATCH = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const { label, thumbnail } = body;
    const { params } = context;
    const { id } = params;

    // Check required field
    Checker.checkRequired(id);

    // Validation
    Checker.checkString(label);
    Checker.checkString(thumbnail);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Check existing ID
    const [rows]: any[] = await connection.query(
      `SELECT id_type from Type where id_type = ?`,
      [id]
    );
    if (rows.length === 0) throwCustomError("ID not found");

    // Prepare data for update
    const updateData: any = {};
    if (label !== undefined) updateData.label = label;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    if (Object.keys(updateData).length === 0) {
      throwCustomError("No fields to update", 400);
    }

    // Build SQL query for update
    const updateFields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const query = `UPDATE Type SET ${updateFields} WHERE id_type = ?`;

    // Execute the update query
    await connection.query(query, [...Object.values(updateData), id]);

    return objectResponse({ ...updateData, id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const DELETE = async (request: Request, context: any) => {
  try {
    const currentUser = await getCurrentUser(request);
    const { params } = context;
    const { id } = params;

    if (currentUser?.role === "admin") {
      const [rows]: Array<any> = await connection.query(
        "SELECT id_type FROM Type WHERE id_type = ?",
        [id]
      );
      if (!rows || rows.length === 0) throwCustomError("ID not found", 400);

      await connection.query("DELETE FROM Type WHERE id_type = ?", [id]);

      return objectResponse({ deletedID: id });
    } else {
      throwCustomError("Not enough permission", 403);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
