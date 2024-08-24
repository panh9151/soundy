import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getCurrentUser } from "@/utils/Get";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { objectResponse } from "@/utils/Response";

type SoundModel = {
  id_sound: string;
  locationX: number;
  locationY: number;
  defaultPlaying: "0" | "1";
  defaultVolumn: number;
};

type MusicModel = {
  id_music: string;
  isDefault: "0" | "1";
  isShow: "0" | "1";
};

async function processSoundDetails(
  sounds: SoundModel[],
  connection: any,
  addedData: any
) {
  try {
    // Use Promise.all to handle all promises concurrently
    const results = await Promise.all(
      sounds.map(async (sound: SoundModel) => {
        const [result] = await connection.query(
          `call add_scenario_sound_detail(?, ?, ?, ?, ?, ?)`,
          [
            sound.id_sound,
            addedData.id,
            sound.locationX,
            sound.locationY,
            sound.defaultPlaying,
            sound.defaultVolumn,
          ]
        );
        return result; // Collect the result
      })
    );
    // Optionally process the results if needed
    return objectResponse({ a: results });
  } catch (error) {
    // Handle errors appropriately
    console.error("Error processing sound details:", error);
    throw error; // Re-throw or handle as needed
  }
}

async function processMusicDetails(
  musics: MusicModel[],
  connection: any,
  addedData: any
) {
  try {
    // Use Promise.all to handle all promises concurrently
    await Promise.all(
      musics.map(async (music: MusicModel) => {
        await connection.query(`call add_scenario_music_detail(?, ?, ?, ?)`, [
          addedData.id,
          music.id_music,
          music.isDefault,
          music.isShow,
        ]);
      })
    );
    // If needed, return something or handle results
  } catch (error) {
    // Handle errors appropriately
    console.error("Error processing music details:", error);
    throw error; // Re-throw or handle as needed
  }
}

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
                    'thumbnail', tt.thumbnail
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
                'author', JSON_OBJECT(
                    'name', a.name,
                    'thumbnail', a.thumbnail
                ),
                'type', JSON_OBJECT(
                    'label', t.label,
                    'thumbnail', t.thumbnail
                ),
                'isDefault', smd.default_playing
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
                'isDefault', smd.default_playing
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
                'isDefault', smd.default_playing
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
    const {
      sounds = [],
      musics = [],
    }: { sounds: Array<SoundModel> | []; musics: Array<MusicModel> | [] } =
      body;

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

    // Check existing sounds
    if (sounds.length > 0) {
      const [result]: Array<any> = await connection.query(
        `
          select id_sound from Sound where id_sound = '${sounds
            .map((s: SoundModel) => s.id_sound)
            .join("' or id_sound = '")}'
        `,
        []
      );

      if (result.length !== sounds.length)
        throwCustomError("Sound ID not found", 400);
    }

    // Check existing musics
    if (musics.length > 0) {
      const [result]: Array<any> = await connection.query(
        `select id_music from Music where id_music = '${musics
          .map((m: MusicModel) => m.id_music)
          .join("' or id_music = '")}'`,
        []
      );
      if (result.length !== musics.length)
        throwCustomError("Music ID not found", 400);
    }

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

    await processSoundDetails(sounds, connection, addedData);
    await processMusicDetails(musics, connection, addedData);

    return objectResponse({ newID: addedData.id });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
