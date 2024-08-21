import { objectResponse } from "@/utils/Response";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import connection from "@/lib/connection";
import Checker from "@/utils/Checker";

export const GET = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser(request, false);

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
        `,
        []
      );

      Checker.convertJson(musicList as Array<any>, "author", "type");
      return objectResponse([...musicList]);
    } else {
      const [musicList]: Array<any> = await connection.query(
        `
        SELECT 
            m.id_music AS id, 
            m.id_author AS author, 
            m.title, 
            m.music_path AS path, 
            m.last_updated,
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
            Type t ON m.id_type = t.id_type and t.is_show = "1"
        LEFT JOIN 
            Author a ON m.id_author = a.id_author
        WHERE 
            m.is_show = '1';
        `,
        []
      );

      Checker.convertJson(musicList as Array<any>, "author", "type");
      return objectResponse([...musicList]);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { id_author, id_type, title, music_path, is_show = "1" } = body;

    // Check required
    Checker.checkRequired(title, music_path);

    // Validation
    Checker.checkString(id_author);
    Checker.checkString(title);
    Checker.checkString(music_path);
    Checker.checkString(id_type);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Insert data
    const [result]: Array<any> = await connection.query(
      `CALL add_music (?, ?, ?, ?, ?)`,
      [id_author, id_type, title, music_path, is_show]
    );

    const returningData = result[0][0];
    return objectResponse({ newID: returningData.id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
