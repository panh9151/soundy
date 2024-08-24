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
      `SELECT * FROM Author WHERE id_author = ?`,
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
    const { name, thumbnail } = body;
    const { params } = context;
    const { id } = params;

    // Check required field
    Checker.checkRequired(id);

    // Validation
    Checker.checkString(name);
    Checker.checkString(thumbnail);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Check existing ID
    const [rows]: any[] = await connection.query(
      `SELECT id_author from Author where id_author = ?`,
      [id]
    );
    if (rows.length === 0) throwCustomError("ID not found");

    // Prepare data for update
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;

    if (Object.keys(updateData).length === 0) {
      throwCustomError("No fields to update", 400);
    }

    // Build SQL query for update
    const updateFields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const query = `UPDATE Author SET ${updateFields} WHERE id_author = ?`;

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
        "SELECT id_author FROM Author WHERE id_author = ?",
        [id]
      );
      if (!rows || rows.length === 0) throwCustomError("ID not found", 400);

      await connection.query("DELETE FROM Author WHERE id_author = ?", [id]);

      return objectResponse({ deletedID: id });
    } else {
      throwCustomError("Not enough permission", 403);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
