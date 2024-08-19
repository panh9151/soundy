import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { getCurrentUser } from "@/utils/Get";
import { objectResponse } from "@/utils/Response";
import { useRouter } from "next/router";

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
              Type t ON m.id_type = t.id_type and t.is_show = '1'
          JOIN 
              Author a ON m.id_author = a.id_author
          WHERE 
              m.is_show = '1' and m.id_music = ?;
        `,
        [id]
      );

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
