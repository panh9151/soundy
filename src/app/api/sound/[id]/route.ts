import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import Parser from "@/utils/Parser";

export const GET = async (request: Request, context: any) => {
  try {
    const currentUser = await getCurrentUser(request, false);
    const { params } = context;
    const { id } = params;

    if (currentUser?.role === "admin") {
      const [soundList]: Array<any> = await connection.query(
        `
          SELECT 
          s.*,
          ${Parser.queryObject([
            "'thumbnail', t.thumbnail",
            "'label', t.label",
          ])} AS type
          FROM 
              Sound s
          LEFT JOIN 
              Type t ON t.id_type = s.id_type
          WHERE 
              s.id_sound = ?
        `,
        [id]
      );

      Parser.convertJson(soundList, "type");
      return objectResponse({ data: soundList[0] });
    } else if (currentUser?.role === "membership") {
      const [soundList]: Array<any> = await connection.query(
        `
          SELECT 
          s.id_sound,
          s.sound_path as path,
          s.thumbnail,
          s.title,
          s.last_updated as lastUpdated,
          s.created_at as createdAt,
          ${Parser.queryObject([
            "'thumbnail', t.thumbnail",
            "'label', t.label",
          ])} AS type
          FROM 
              Sound s
          LEFT JOIN 
              Type t ON t.id_type = s.id_type
          WHERE 
              s.is_show = '1' and s.id_sound = ?
        `,
        [id]
      );
      Checker.convertJson(soundList, "type");
      return objectResponse([...soundList]);
    } else {
      const query = `
      SELECT 
      s.id_sound,
      s.sound_path as path,
      s.thumbnail,
      s.title,
      s.last_updated as lastUpdated,
      s.created_at as createdAt,
      ${Parser.queryObject([
        "'thumbnail', t.thumbnail",
        "'label', t.label",
      ])} AS type
      FROM 
          Sound s
      LEFT JOIN 
          Type t ON t.id_type = s.id_type
      WHERE 
          s.is_show = '1'
          and s.is_free = '1'
          and s.id_sound = ?
    `;
      const [soundList]: any[] = await connection.query(query, [id]);
      Checker.convertJson(soundList, "type");
      return objectResponse({ data: soundList[0] });
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const PATCH = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const { id_type, sound_path, thumbnail, title, is_free, is_show } = body;
    const { params } = context;
    const { id } = params;

    // Check required field
    Checker.checkRequired(id);

    // Validation
    Checker.checkString(id_type);
    Checker.checkString(sound_path);
    Checker.checkString(thumbnail);
    Checker.checkString(title);
    Checker.checkIncluded(is_free, ["0", "1"]);
    Checker.checkIncluded(is_show, ["0", "1"]);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Check existing ID
    const [rows]: any[] = await connection.query(
      `SELECT id_sound from Sound where id_sound = ?`,
      [id]
    );
    if (rows.length === 0) throwCustomError("ID not found");

    // Prepare data for update
    const updateData: any = {};
    if (id_type !== undefined) updateData.id_type = id_type;
    if (sound_path !== undefined) updateData.sound_path = sound_path;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (title !== undefined) updateData.title = title;
    if (is_free !== undefined) updateData.is_free = is_free;
    if (is_show !== undefined) updateData.is_show = is_show;

    if (Object.keys(updateData).length === 0) {
      throwCustomError("No fields to update", 400);
    }

    // Build SQL query for update
    const updateFields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const query = `UPDATE Sound SET ${updateFields} WHERE id_sound = ?`;

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
        "SELECT id_sound FROM Sound WHERE id_sound = ?",
        [id]
      );
      if (!rows || rows.length === 0) throwCustomError("ID not found", 400);

      await connection.query("DELETE FROM Sound WHERE id_sound = ?", [id]);

      return objectResponse({ deletedID: id });
    } else {
      throwCustomError("Not enough permission", 403);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
