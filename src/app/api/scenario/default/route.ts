import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

export const GET = async (request: Request) => {
  try {
    const [scenarioList]: Array<any> = await connection.query(
      `SELECT 
        s.id_scenario as id,
        s.name,
        s.img_path as path,
        s.last_updated as lastUpdated,
        s.created_at as createdAt,
        s.day_url,
        s.night_url,
        s.rain_day_url,
        s.rain_night_url,
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
                )
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
            s.is_show = '1' 
            AND s.is_free = '1'
            AND NOW() BETWEEN s.free_time_start AND s.free_time_end
        GROUP BY 
            s.id_scenario
        ORDER BY 
            s.last_updated DESC
        LIMIT 1;`,
      []
    );
    Checker.convertJson(scenarioList as Array<any>, "sounds", "musics");
    return objectResponse({ data: scenarioList[0] });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
