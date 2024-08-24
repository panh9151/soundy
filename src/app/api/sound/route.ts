import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";
import Parser from "@/utils/Parser";

export const GET = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser(request, false);

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
        `,
        []
      );

      Parser.convertJson(soundList, "type");
      return objectResponse([...soundList]);
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
              s.is_show = '1'
        `,
        []
      );
      Checker.convertJson(soundList, "type");
      return objectResponse([...soundList]);
    } else {
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
              s.is_show = '1'
              and s.is_free = '1'
        `,
        []
      );
      Checker.convertJson(soundList as Array<any>, "type");
      return objectResponse([...soundList]);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const { id_type, sound_path, thumbnail, title, is_free, is_show } = body;

    // Check required
    Checker.checkRequired(sound_path, title);

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

    // Update DB
    const [result]: Array<any> = await connection.query(
      `CALL add_sound(?, ?, ?, ?, ?, ?);`,
      [id_type, sound_path, thumbnail, title, is_free, is_show]
    );
    const addedData = result[0][0];

    return objectResponse({ newID: addedData.id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
