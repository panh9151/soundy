import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request) => {
  try {
    const currentUser = await getCurrentUser(request, false);

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
        GROUP BY 
            s.id_scenario;    
        `,
        []
      );
      Checker.convertJson(scenarioList, "sounds", "musics");
      return objectResponse([...scenarioList]);
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
        GROUP BY 
            s.id_scenario;  
        `,
        []
      );
      Checker.convertJson(scenarioList, "sounds", "musics");
      return objectResponse([...scenarioList]);
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
            s.is_show = '1' 
            AND s.set_free = '1'
            AND NOW() BETWEEN s.free_time_start AND s.free_time_end
        GROUP BY 
            s.id_scenario;`,
        []
      );
      Checker.convertJson(scenarioList as Array<any>, "sounds", "musics");
      return objectResponse([...scenarioList]);
    }
  } catch (error) {
    return getServerErrorMsg(error);
  }
};

export const POST = async (request: Request) => {
  try {
    const body = await request.json();
    const {
      name,
      img_path,
      set_free = "1",
      free_time_start,
      free_time_end,
      type = "day",
      is_default = "0",
      is_show = "1",
    } = body;

    // Check required
    Checker.checkRequired(name, img_path);

    // Validation
    Checker.checkString(name);
    Checker.checkString(img_path);
    Checker.checkString(set_free);
    Checker.checkString(free_time_start);
    Checker.checkString(free_time_end);
    Checker.checkIncluded(type, ["day", "night", "rain"]);
    Checker.checkIncluded(is_default, ["0", "1"]);
    Checker.checkIncluded(is_show, ["0", "1"]);

    // Check permission
    const currentUser = await getCurrentUser(request);
    if (currentUser?.role !== "admin")
      throwCustomError("Not enough permission", 403);

    // Update DB
    const [result]: Array<any> = await connection.query(
      `CALL add_scenario(?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        img_path,
        set_free,
        free_time_start,
        free_time_end,
        type,
        is_default,
        is_show,
      ]
    );

    const addedData = result[0][0];
    return objectResponse({ newID: addedData.id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};