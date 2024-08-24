import connection from "@/lib/connection";
import { getServerErrorMsg } from "@/utils/Error";
import { getCurrentUser } from "@/utils/Get";
import Parser from "@/utils/Parser";
import { objectResponse } from "@/utils/Response";

export const GET = async (req: Request) => {
  try {
    const currentUser = await getCurrentUser(req, true);
    const query = `
    SELECT 
        t.id_template,
        t.last_updated,
        t.music_volumn,
        ${Parser.queryObject([
          "'id', s.id_scenario",
          "'name', s.name",
          "'path', s.img_path",
          "'type', s.type",
          "'lastUpdated', s.last_updated",
          "'createdAt', s.created_at",
        ])} as scenario,
        ${Parser.queryObject([
          "'id', m.id_music",
          "'title', m.title",
          "'path', m.music_path",
          "'lastUpdated', m.last_updated",
          "'createdAt', m.created_at",
          `'author', ${Parser.queryObject([
            "'name', a.name",
            "'thumbnail', a.thumbnail",
          ])}`,
          `'type', ${Parser.queryObject([
            "'label', ty.label",
            "'thumbnail', ty.thumbnail",
          ])}`,
        ])} as music,
        ${Parser.queryObject([
          "'volumn', st.volumn",
          "'path', so.sound_path",
          "'thumbnail', so.thumbnail",
          "'title', so.title",
          "'lastUpdated', so.last_updated",
          "'createdAt', so.created_at",
          `'type', ${Parser.queryObject([
            "'label', sty.label",
            "'thumbnail', sty.thumbnail",
          ])}`,
        ])} as sounds
    FROM 
        Template t
    LEFT JOIN 
        Scenario s on s.id_scenario = t.id_scenario
    LEFT JOIN
        Music m on m.id_music = t.id_music
    LEFT JOIN
        Type ty on ty.id_type = m.id_type
    LEFT JOIN
        Author a on a.id_author = m.id_author
    LEFT JOIN   
        SoundTemplate st on st.id_template = t.id_template
    LEFT JOIN
        Sound so on st.id_sound = so.id_sound
    LEFT JOIN 
            Type sty on sty.id_type = so.id_type
    WHERE 
        id_user = ?
    `;
    // return objectResponse(query);

    const [template]: any[] = await connection.query(query, [
      currentUser.id_user,
    ]);

    Parser.convertJson(template, "music", "scenario", "sounds");
    return objectResponse({ template });
  } catch (error) {
    getServerErrorMsg(error);
  }
};
