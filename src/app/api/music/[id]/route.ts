import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { getCurrentUser } from "@/utils/Get";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request, context: any) => {
  try {
    const currentUser = await getCurrentUser(request, false);
    const { params } = context;
    const { id } = params;

    if (currentUser?.role === "admin") {
      const [musicList]: Array<any> = await connection.query(
        `SELECT 
              m.*,
              JSON_OBJECT(
                  'id', t.id_type,
                  'thumbnail', t.thumbnail,
                  'label', t.label
              ) AS type,
              JSON_OBJECT(
                  'id', a.id_author,
                  'name', a.name,
                  'thumbnail', a.thumbnail
              ) AS author
          FROM 
              Music m
          LEFT JOIN 
              Type t ON m.id_type = t.id_type
          LEFT JOIN 
              Author a ON m.id_author = a.id_author
          WHERE
              m.id_music = ?
        `,
        [id]
      );

      if (!musicList || musicList.length === 0) {
        throwCustomError("ID not found", 400);
      }
      Checker.convertJson(musicList as Array<any>, "author", "type");

      return objectResponse({ ...musicList[0] });
    } else {
      let query = `
      SELECT 
          m.id_music AS id, 
          m.id_author AS author, 
          m.title, 
          m.music_path AS path, 
          m.last_updated,
          m._index,
          JSON_OBJECT(
              'id', t.id_type,
              'thumbnail', t.thumbnail,
              'label', t.label
          ) AS type,
          JSON_OBJECT(
              'id', a.id_author,
              'name', a.name,
              'thumbnail', a.thumbnail
          ) AS author
      FROM 
          Music m
      LEFT JOIN 
          Type t ON m.id_type = t.id_type
      JOIN 
          Author a ON m.id_author = a.id_author
      WHERE 
          m.id_music = ? 
          and m.is_show = "1"
    `;
      if (currentUser?.role !== "membership") query += " and m.is_free = '1'";
      const [musicList]: Array<any> = await connection.query(query, [id]);

      if (!musicList || musicList.length === 0) {
        throwCustomError("ID not found", 400);
      }

      Checker.convertJson(musicList as Array<any>, "author", "type");
      return objectResponse({ ...musicList[0] });
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const PATCH = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const { id_author, title, music_path, id_type } = body;
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    const { params } = context;
    const { id } = params;

    // Check required
    // Checker.checkRequired(title, music_path);

    // Validation
    Checker.checkString(id_author);
    Checker.checkString(title);
    Checker.checkString(music_path);
    Checker.checkString(id_type);

    // GET update data
    const updatedData: any = {};
    if (id_author !== undefined) updatedData.id_author = id_author;
    if (title !== undefined) updatedData.title = title;
    if (music_path !== undefined) updatedData.music_path = music_path;
    if (id_type !== undefined) updatedData.id_type = id_type;

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Check if existing ID
    const [rows]: Array<any> = await connection.query(
      "SELECT id_music FROM Music WHERE id_music = ?",
      [id]
    );
    if (!rows || rows.length === 0) throwCustomError("ID not found", 400);

    // return objectResponse({
    //   a: `UPDATE Music SET ${Object.keys(updatedData).join(
    //     " = ?, "
    //   )} = ? WHERE id_music = ?`,
    //   b: [Object.values(updatedData), id],
    // });

    // Update
    await connection.query(
      `UPDATE Music SET ${Object.keys(updatedData).join(
        " = ?, "
      )} = ? WHERE id_music = ?`,
      [...Object.values(updatedData), id]
    );

    return objectResponse({ updatedData: { ...updatedData, id } });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const DELETE = async (request: Request, context: any) => {
  try {
    const currentUser = await getCurrentUser(request);
    // const { searchParams } = new URL(request.url);
    // const id = searchParams.get("id");
    const { params } = context;
    const { id } = params;

    if (!id) throwCustomError("ID not found", 400);

    if (currentUser?.role === "admin") {
      // Check existing ID
      const [rows]: Array<any> = await connection.query(
        "select id_music from Music where id_music = ?",
        [id]
      );
      if (!rows || rows.length === 0) throwCustomError("ID not found", 400);

      const [deletedData]: Array<any> = await connection.query(
        `delete from Music where id_music = ?`,
        [id]
      );

      // Checker.convertJson(musicList as Array<any>, "author", "type");
      return objectResponse({ deletedID: id });
    } else {
      throwCustomError("Not enough permission", 403);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
