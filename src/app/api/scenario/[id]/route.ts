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

    if (currentUser?.role === "admin") {
      const [scenarioList]: Array<any> = await connection.query(
        `SELECT 
        s.*, 
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', ss.id_sound,
                'type', JSON_OBJECT(
                    'label', tt.label,
                    'thumbnail', tt.thumbnail,
                    'isShow', tt.is_show
                ),
                'path', ss.sound_path,
                'thumbnail', ss.thumbnail,
                'title', ss.title,
                'lastUpdate', ss.last_updated,
                'createdAt', ss.created_at
            )
            SEPARATOR ','), ']') AS sounds,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', sm.id_music,
                'title', sm.title,
                'path', sm.music_path,
                'lastUpdate', sm.last_updated,
                'createdAt', sm.created_at,
                'isShow', smd.is_show,
                'author', JSON_OBJECT(
                    'name', a.name,
                    'thumbnail', a.thumbnail
                ),
                'type', JSON_OBJECT(
                    'label', t.label,
                    'thumbnail', t.thumbnail,
                    'isShow', t.is_show
                ),
                'isDefault', smd.is_default
            )
            SEPARATOR ','), ']') AS musics
        FROM 
            Scenario s
        LEFT JOIN 
            ScenarioSoundDetail ssd ON ssd.id_scenario = s.id_scenario
        LEFT JOIN 
            Sound ss ON ss.id_sound = ssd.id_sound
        LEFT JOIN
            ScenarioMusicDetail smd ON smd.id_scenario = s.id_scenario
        LEFT JOIN
            Music sm ON sm.id_music = smd.id_music
        LEFT JOIN
            Author a ON a.id_author = sm.id_author
        LEFT JOIN
            Type t ON t.id_type = sm.id_type
        LEFT JOIN 
            Type tt ON tt.id_type = ss.id_type
        WHERE 
            s.id_scenario = ?
        GROUP BY 
            s.id_scenario;    
        `,
        [id]
      );

      if (scenarioList.length !== 1)
        throwCustomError("ID scenario not found", 400);

      Checker.convertJson(scenarioList, "sounds", "musics");
      return objectResponse(scenarioList[0]);
    } else if (currentUser?.role === "membership") {
      const [scenarioList]: Array<any> = await connection.query(
        `SELECT 
        s.id_scenario as id,
        s.name,
        s.img_path as path,
        s.type,
        s.is_default as isDefault,
        s.last_updated as lastUpdated,
        s.created_at as createdAt,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', ss.id_sound,
                'type', JSON_OBJECT(
                    'label', tt.label,
                    'thumbnail', tt.thumbnail
                ),
                'path', ss.sound_path,
                'thumbnail', ss.thumbnail,
                'title', ss.title,
                'lastUpdate', ss.last_updated,
                'createdAt', ss.created_at,
                'locationX', ssd.location_x,
                'locationY', ssd.location_y,
                'defaultPlaying', ssd.default_playing,
                'defaultVolumn', ssd.default_volumn
            )
            SEPARATOR ','), ']') AS sounds,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', sm.id_music,
                'title', sm.title,
                'path', sm.music_path,
                'lastUpdate', sm.last_updated,
                'createdAt', sm.created_at,
                'author', JSON_OBJECT(
                    'name', a.name,
                    'thumbnail', a.thumbnail
                ),
                'type', JSON_OBJECT(
                    'label', t.label,
                    'thumbnail', t.thumbnail
                ),
                'isDefault', smd.is_default
            )
            SEPARATOR ','), ']') AS musics
        FROM 
            Scenario s
        LEFT JOIN 
            ScenarioSoundDetail ssd ON ssd.id_scenario = s.id_scenario
        LEFT JOIN 
            Sound ss ON ss.id_sound = ssd.id_sound
        LEFT JOIN
            ScenarioMusicDetail smd ON smd.id_scenario = s.id_scenario and smd.is_show = '1'
        LEFT JOIN
            Music sm ON sm.id_music = smd.id_music and smd.is_show = '1'
        LEFT JOIN
            Author a ON a.id_author = sm.id_author
        LEFT JOIN
            Type t ON t.id_type = sm.id_type
        LEFT JOIN 
            Type tt ON tt.id_type = ss.id_type
        WHERE 
            s.is_show = '1' 
            AND s.id_scenario = ?
        GROUP BY 
            s.id_scenario;  
        `,
        [id]
      );

      if (scenarioList.length !== 1)
        throwCustomError("ID scenario not found", 400);

      Checker.convertJson(scenarioList, "sounds", "musics");
      return objectResponse(scenarioList[0]);
    } else {
      const [scenarioList]: Array<any> = await connection.query(
        `SELECT 
        s.id_scenario as id,
        s.name,
        s.img_path as path,
        s.type,
        s.is_default as isDefault,
        s.last_updated as lastUpdated,
        s.created_at as createdAt,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', ss.id_sound,
                'type', JSON_OBJECT(
                    'label', tt.label,
                    'thumbnail', tt.thumbnail
                ),
                'path', ss.sound_path,
                'thumbnail', ss.thumbnail,
                'title', ss.title,
                'lastUpdate', ss.last_updated,
                'createdAt', ss.created_at,
                'locationX', ssd.location_x,
                'locationY', ssd.location_y,
                'defaultPlaying', ssd.default_playing,
                'defaultVolumn', ssd.default_volumn
            )
            SEPARATOR ','), ']') AS sounds,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'id', sm.id_music,
                'title', sm.title,
                'path', sm.music_path,
                'lastUpdate', sm.last_updated,
                'createdAt', sm.created_at,
                'author', JSON_OBJECT(
                    'name', a.name,
                    'thumbnail', a.thumbnail
                ),
                'type', JSON_OBJECT(
                    'label', t.label,
                    'thumbnail', t.thumbnail
                ),
                'isDefault', smd.is_default
            )
            SEPARATOR ','), ']') AS musics
        FROM 
            Scenario s
        LEFT JOIN 
            ScenarioSoundDetail ssd ON ssd.id_scenario = s.id_scenario
        LEFT JOIN 
            Sound ss ON ss.id_sound = ssd.id_sound
        LEFT JOIN
            ScenarioMusicDetail smd ON smd.id_scenario = s.id_scenario and smd.is_show = '1'
        LEFT JOIN
            Music sm ON sm.id_music = smd.id_music and smd.is_show = '1'
        LEFT JOIN
            Author a ON a.id_author = sm.id_author
        LEFT JOIN
            Type t ON t.id_type = sm.id_type
        LEFT JOIN 
            Type tt ON tt.id_type = ss.id_type
        WHERE  
            s.id_scenario = ?
            AND s.is_show = '1' 
            AND s.set_free = '1'
            AND NOW() BETWEEN s.free_time_start AND s.free_time_end
        GROUP BY 
            s.id_scenario;`,
        [id]
      );

      if (scenarioList.length !== 1)
        throwCustomError("ID scenario not found", 400);

      Checker.convertJson(scenarioList as Array<any>, "sounds", "musics");
      return objectResponse(scenarioList[0]);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const PATCH = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const {
      name,
      img_path,
      set_free,
      free_time_start,
      free_time_end,
      type,
      is_default,
      is_show,
    } = body;
    const { params } = context;
    const { id } = params; // ID của kịch bản cần cập nhật

    // Check required fields
    Checker.checkRequired(id);

    // Validation
    if (name !== undefined) Checker.checkString(name);
    if (img_path !== undefined) Checker.checkString(img_path);
    if (set_free !== undefined) Checker.checkString(set_free);
    if (free_time_start !== undefined) Checker.checkString(free_time_start);
    if (free_time_end !== undefined) Checker.checkString(free_time_end);
    if (type !== undefined)
      Checker.checkIncluded(type, ["day", "night", "rain"]);
    if (is_default !== undefined) Checker.checkIncluded(is_default, ["0", "1"]);
    if (is_show !== undefined) Checker.checkIncluded(is_show, ["0", "1"]);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Check if the ID exists
    const [rows]: Array<any> = await connection.query(
      "SELECT id_scenario FROM Scenario WHERE id_scenario = ?",
      [id]
    );
    if (!rows || rows.length === 0) throwCustomError("ID not found", 404);

    // Prepare data for update
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (img_path !== undefined) updateData.img_path = img_path;
    if (set_free !== undefined) updateData.set_free = set_free;
    if (free_time_start !== undefined)
      updateData.free_time_start = free_time_start;
    if (free_time_end !== undefined) updateData.free_time_end = free_time_end;
    if (type !== undefined) updateData.type = type;
    if (is_default !== undefined) updateData.is_default = is_default;
    if (is_show !== undefined) updateData.is_show = is_show;

    if (Object.keys(updateData).length === 0) {
      throwCustomError("No fields to update", 400);
    }

    // Build SQL query for update
    const updateFields = Object.keys(updateData)
      .map((field) => `${field} = ?`)
      .join(", ");
    const query = `UPDATE Scenario SET ${updateFields} WHERE id_scenario = ?`;

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
        "SELECT id_scenario FROM Scenario WHERE id_scenario = ?",
        [id]
      );
      if (!rows || rows.length === 0) throwCustomError("ID not found", 400);

      await connection.query("DELETE FROM Scenario WHERE id_scenario = ?", [
        id,
      ]);

      return objectResponse({ deletedID: id });
    } else {
      throwCustomError("Not enough permission", 403);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
