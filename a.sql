
      SELECT 
      s.id_sound,
      s.sound_path as path,
      s.thumbnail,
      s.title,
      s.last_updated as lastUpdated,
      s.created_at as createdAt,
      
    JSON_OBJECT(
          'thumbnail', t.thumbnail,
'label', t.label
    )
     AS type
      FROM 
          Sound s
      LEFT JOIN 
          Type t ON t.id_type = s.id_type
      WHERE 
          s.is_show = '1'
          and s.is_free = '1'
          and s.id_sound = ?
    