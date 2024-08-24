import connection from "@/lib/connection";
import Checker from "@/utils/Checker";
import { getServerErrorMsg, throwCustomError } from "@/utils/Error";
import { getCurrentUser } from "@/utils/Get";
import Parser from "@/utils/Parser";
import { objectResponse } from "@/utils/Response";

type SoundModel = {
  id_sound: string;
  volumn: string;
};

export const PATCH = async (request: Request, context: any) => {
  try {
    const body = await request.json();
    const currentUser = await getCurrentUser(request, true);
    const { id_scenario, id_music, music_volumn, sounds = [] } = body;
    const { params } = context;
    const { id } = params;
    const id_user = id;

    // Check required
    Checker.checkRequired(id_user, id_scenario);

    // Validation
    Checker.checkString(id_user);
    Checker.checkString(id_scenario);
    Checker.checkString(id_music);
    Checker.checkNumber(music_volumn);
    sounds.forEach((sound: SoundModel) => {
      Checker.checkString(sound.id_sound);
      Checker.checkNumber(sound.volumn);
    });

    // Check correct user
    const [user]: any[] = await connection.query(
      `SELECT id_user FROM User WHERE id_user = ?`,
      [id_user]
    );
    if (user.length !== 1) throwCustomError("User not found", 404);
    // Check existing Scenario
    const [scenario]: any[] = await connection.query(
      `SELECT id_scenario FROM Scenario WHERE id_scenario = ?`,
      [id_scenario]
    );
    if (scenario.length !== 1) throwCustomError("Scenario not found", 404);

    // Check existing Music
    const [music]: any[] = await connection.query(
      `SELECT id_music FROM Music WHERE id_music = ?`,
      [id_music]
    );
    if (music.length !== 1) throwCustomError("Music not found", 404);

    // Check existing Sounds
    const [soundList]: any[] = await connection.query(
      `SELECT id_sound FROM Sound WHERE id_sound = '${sounds
        .map((sound: SoundModel) => sound.id_sound)
        .join("'OR id_sound = '")}'`,
      []
    );
    if (soundList.length !== sounds.length)
      throwCustomError("ID sound not found", 404);

    // Update DB
    const [result]: any[] = await connection.query(
      `CALL update_template(?, ?, ?, ?)`,
      [id_user, id_scenario, id_music, music_volumn]
    );
    const updatedData = result[0][0];
    updatedData.sounds = [];

    // Update DB SoundTemplate
    await Promise.all(
      sounds.map(async (sound: SoundModel) => {
        const [soundResult]: any[] = await connection.query(
          `CALL update_sound_template(?, ?, ?)`,
          [sound.id_sound, updatedData.id, sound.volumn]
        );
        updatedData.sounds.push(soundResult[0][0]);
      })
    );

    return objectResponse({ result: updatedData });
  } catch (error) {
    return getServerErrorMsg(error);
  }
};
