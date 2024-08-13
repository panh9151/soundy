ALTER DATABASE Soundy CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

use Soundy;

-- Xóa các bảng
DROP TABLE IF EXISTS ScenarioMusicDetail;

DROP TABLE IF EXISTS SoundTemplate;

DROP TABLE IF EXISTS ScenarioSoundDetail;

DROP TABLE IF EXISTS Template;

DROP TABLE IF EXISTS PeriodMembership;

DROP TABLE IF EXISTS Sound;

DROP TABLE IF EXISTS Scenario;

DROP TABLE IF EXISTS Music;

DROP TABLE IF EXISTS Type;

DROP TABLE IF EXISTS User;

DROP TABLE IF EXISTS Author;

-- Tạo bảng Author
CREATE TABLE Author (
  id_author VARCHAR(40) PRIMARY KEY,
  name VARCHAR(255),
  thumbnail VARCHAR(255)
);

-- Tạo bảng Type
CREATE TABLE Type (
  id_type VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  label VARCHAR(255),
  thumbnail VARCHAR(255),
  is_show ENUM("0", "1") not null default "1"
);

-- Tạo bảng User
CREATE TABLE User (
  id_user VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  middle_name VARCHAR(20),
  role enum("user", "admin") not null DEFAULT "user",
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  avatar_path VARCHAR(255),
  phone VARCHAR(12),
  gender ENUM('male', 'female'),
  age INT,
  id_google VARCHAR(255) UNIQUE,
  is_banned ENUM("0", "1") DEFAULT "0",
  last_updated DATETIME DEFAULT now(),
  created_date DATETIME DEFAULT now(),
  token_reset VARCHAR(255),
  expired_token_reset BIGINT
);

-- Tạo bảng Music
CREATE TABLE Music (
  id_music VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_author VARCHAR(40),
  id_type VARCHAR(40),
  title VARCHAR(255) NOT NULL UNIQUE,
  music_path VARCHAR(255),
  last_updated DATETIME DEFAULT now(),
  created_at DATETIME DEFAULT now(),
  is_show ENUM("0", "1") DEFAULT "1",
  FOREIGN KEY (id_author) REFERENCES Author(id_author),
  FOREIGN KEY (id_type) REFERENCES Type(id_type)
);

-- Tạo bảng Scenario
CREATE TABLE Scenario (
  id_scenario VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  name VARCHAR(255),
  img_path VARCHAR(255),
  set_free ENUM("0", "1") DEFAULT "1",
  free_time_start DATETIME,
  free_time_end DATETIME,
  type enum("day", "night", "raining") DEFAULT "day",
  is_default ENUM("0", "1") DEFAULT "0",
  last_updated DATETIME DEFAULT now(),
  created_at DATETIME DEFAULT now(),
  is_show ENUM("0", "1") DEFAULT "1"
);

-- Tạo bảng Sound
CREATE TABLE Sound (
  id_sound VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_type VARCHAR(40),
  sound_path VARCHAR(255),
  thumbnail VARCHAR(255),
  title VARCHAR(255),
  last_updated DATETIME DEFAULT now(),
  created_at DATETIME DEFAULT now(),
  FOREIGN KEY (id_type) REFERENCES Type(id_type)
);

-- Tạo bảng PeriodMembership
CREATE TABLE PeriodMembership (
  id_membership VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_user VARCHAR(40),
  created_date DATETIME NOT NULL DEFAULT now(),
  last_updated DATETIME NOT NULL DEFAULT now(),
  start DATETIME NOT NULL,
end DATETIME NOT NULL,
price DOUBLE NOT NULL,
payment_method VARCHAR(10) NOT NULL,
is_paid ENUM("paid", "unpaid", "returned", "processing") DEFAULT "processing",
FOREIGN KEY (id_user) REFERENCES User(id_user)
);

-- Tạo bảng Template
CREATE TABLE Template (
  id_template VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_user VARCHAR(40) NOT NULL,
  id_scenario VARCHAR(40) NOT NULL,
  id_music VARCHAR(40) NOT NULL,
  last_updated DATETIME NOT NULL DEFAULT now(),
  FOREIGN KEY (id_user) REFERENCES User(id_user),
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario),
  FOREIGN KEY (id_music) REFERENCES Music(id_music)
);

-- Tạo bảng ScenarioSoundDetail
CREATE TABLE ScenarioSoundDetail (
  id_concatenation VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_sound VARCHAR(40) NOT NULL,
  id_scenario VARCHAR(40) NOT NULL,
  location_x FLOAT NOT NULL,
  location_y FLOAT NOT NULL,
  default_playing float DEFAULT false,
  default_volumn float DEFAULT 0.5,
  FOREIGN KEY (id_sound) REFERENCES Sound(id_sound),
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario)
);

-- Tạo bảng SoundTemplate
CREATE TABLE SoundTemplate (
  id_sound_template VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_sound VARCHAR(40),
  id_template VARCHAR(40),
  volumn FLOAT not null default 0,
  FOREIGN KEY (id_sound) REFERENCES Sound(id_sound),
  FOREIGN KEY (id_template) REFERENCES Template(id_template)
);

-- Tạo bảng ScenarioMusicDetail
CREATE TABLE ScenarioMusicDetail (
  id_concatenation VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_scenario VARCHAR(40) NOT NULL,
  id_music VARCHAR(40) NOT NULL,
  is_default ENUM("0", "1") DEFAULT "0",
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario),
  FOREIGN KEY (id_music) REFERENCES Music(id_music)
);

-- Xóa triggers 
DROP TRIGGER IF EXISTS trg_update_user_time;

DROP TRIGGER IF EXISTS trg_update_sound_time;

DROP TRIGGER IF EXISTS trg_update_scenario_time;

DROP TRIGGER IF EXISTS trg_update_template_time;

DROP TRIGGER IF EXISTS trg_update_membership_time;

DROP TRIGGER IF EXISTS trg_update_user_time;

-- Trigger cho bảng Sound
DELIMITER $ $

CREATE TRIGGER trg_update_sound_time BEFORE
UPDATE
  ON Sound FOR EACH ROW BEGIN
SET
  NEW.last_updated = NOW();

END;

$ $ DELIMITER

-- Trigger cho bảng Scenario
DELIMITER $ $

CREATE TRIGGER trg_update_scenario_time BEFORE
UPDATE
  ON Scenario FOR EACH ROW BEGIN
SET
  NEW.last_updated = NOW();

END;

$ $ DELIMITER

-- Trigger cho bảng Music
DELIMITER $ $;

CREATE TRIGGER trg_update_music_time BEFORE
UPDATE
  ON Music FOR EACH ROW BEGIN
SET
  NEW.last_updated = NOW();

END;

$ $ DELIMITER

-- Trigger cho bảng Template
DELIMITER $ $;

CREATE TRIGGER trg_update_template_time BEFORE
UPDATE
  ON Template FOR EACH ROW BEGIN
SET
  NEW.last_updated = NOW();

END;

$ $ DELIMITER

-- Trigger cho bảng PeriodMembership
DELIMITER $ $;

CREATE TRIGGER trg_update_membership_time BEFORE
UPDATE
  ON PeriodMembership FOR EACH ROW BEGIN
SET
  NEW.last_updated = NOW();

END;

$ $ DELIMITER

-- Trigger cho bảng User
DELIMITER $ $;

CREATE TRIGGER trg_update_user_time BEFORE
UPDATE
  ON User FOR EACH ROW BEGIN
SET
  NEW.last_updated = NOW();

END;

$ $ DELIMITER

-- 1. Chèn dữ liệu vào bảng Author
INSERT INTO
  Author (id_author, name, thumbnail)
VALUES
  (uuid(), 'John Doe', 'thumbnail_john_doe.png'),
  (uuid(), 'Jane Smith', 'thumbnail_jane_smith.png');

-- 2. Chèn dữ liệu vào bảng Type
INSERT INTO
  Type (id_type, label, thumbnail, is_show)
VALUES
  (
    uuid(),
    'Music Type 1',
    'thumbnail_music_type_1.png',
    true
  ),
  (
    uuid(),
    'Music Type 2',
    'thumbnail_music_type_2.png',
    false
  );

-- 3. Chèn dữ liệu vào bảng User
INSERT INTO
  User (
    id_user,
    first_name,
    last_name,
    middle_name,
    role,
    email,
    password,
    avatar_path,
    phone,
    gender,
    age,
    id_google,
    is_banned,
    token_reset,
    expired_token_reset
  )
VALUES
  (
    uuid(),
    'Alice',
    'Wonderland',
    NULL,
    "user",
    "panh9151@gmail.com",
    "$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2",
    'avatar_alice.png',
    '1234567890',
    'female',
    25,
    'alice_google_id',
    false,
    NULL,
    NULL
  ),
  (
    uuid(),
    'Bob',
    'Builder',
    'The',
    "admin",
    "anhpt2611@gmail.com",
    "$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2",
    'avatar_bob.png',
    '0987654321',
    'male',
    30,
    'bob_google_id',
    false,
    NULL,
    NULL
  );

-- 4. Chèn dữ liệu vào bảng Music
-- Lưu ý: id_author và id_type phải khớp với các giá trị đã được chèn vào bảng Author và Type trước đó
INSERT INTO
  Music (
    id_music,
    id_author,
    id_type,
    title,
    music_path,
    last_updated,
    created_at,
    is_show
  )
VALUES
  (
    uuid(),
    (
      SELECT
        id_author
      FROM
        Author
      WHERE
        name = 'John Doe'
    ),
    (
      SELECT
        id_type
      FROM
        Type
      WHERE
        label = 'Music Type 1'
    ),
    'Sample Music 1',
    'path_to_music_1.mp3',
    now(),
    now(),
    true
  ),
  (
    uuid(),
    (
      SELECT
        id_author
      FROM
        Author
      WHERE
        name = 'Jane Smith'
    ),
    (
      SELECT
        id_type
      FROM
        Type
      WHERE
        label = 'Music Type 2'
    ),
    'Sample Music 2',
    'path_to_music_2.mp3',
    now(),
    now(),
    true
  );

-- 5. Chèn dữ liệu vào bảng Scenario
INSERT INTO
  Scenario (
    id_scenario,
    name,
    img_path,
    set_free,
    last_updated,
    created_at,
    is_show
  )
VALUES
  (
    uuid(),
    'Sample Scenario 1',
    'path_to_image_1.png',
    false,
    now(),
    now(),
    true
  ),
  (
    uuid(),
    'Sample Scenario 2',
    'path_to_image_2.png',
    true,
    now(),
    now(),
    true
  );

-- 6. Chèn dữ liệu vào bảng Sound
INSERT INTO
  Sound (
    id_sound,
    id_type,
    sound_path,
    thumbnail,
    title,
    last_updated,
    created_at
  )
VALUES
  (
    uuid(),
    (
      SELECT
        id_type
      FROM
        Type
      WHERE
        label = 'Music Type 1'
    ),
    'path_to_sound_1.mp3',
    'thumbnail_sound_1.png',
    'Sound 1',
    now(),
    now()
  ),
  (
    uuid(),
    (
      SELECT
        id_type
      FROM
        Type
      WHERE
        label = 'Music Type 2'
    ),
    'path_to_sound_2.mp3',
    'thumbnail_sound_2.png',
    'Sound 2',
    now(),
    now()
  );

-- 7. Chèn dữ liệu vào bảng PeriodMembership
-- Lưu ý: id_user phải khớp với giá trị đã được chèn vào bảng User trước đó
INSERT INTO
  PeriodMembership (
    id_membership,
    id_user,
    created_date,
    last_updated,
    start,
  end,
  price,
  payment_method,
  is_paid
)
VALUES
  (
    uuid(),
    (
      SELECT
        id_user
      FROM
        User
      WHERE
        first_name = 'Alice'
    ),
    now(),
    now(),
    now(),
    DATE_ADD(now(), INTERVAL 1 YEAR),
    99.99,
    'credit_card',
    true
  ),
  (
    uuid(),
    (
      SELECT
        id_user
      FROM
        User
      WHERE
        first_name = 'Bob'
    ),
    now(),
    now(),
    now(),
    DATE_ADD(now(), INTERVAL 6 MONTH),
    49.99,
    'paypal',
    false
  );

-- 8. Chèn dữ liệu vào bảng Template
-- Lưu ý: id_user, id_scenario và id_music phải khớp với các giá trị đã được chèn vào các bảng User, Scenario và Music trước đó
INSERT INTO
  Template (
    id_template,
    id_user,
    id_scenario,
    id_music,
    last_updated
  )
VALUES
  (
    uuid(),
    (
      SELECT
        id_user
      FROM
        User
      WHERE
        first_name = 'Alice'
    ),
    (
      SELECT
        id_scenario
      FROM
        Scenario
      WHERE
        name = 'Sample Scenario 1'
    ),
    (
      SELECT
        id_music
      FROM
        Music
      WHERE
        title = 'Sample Music 1'
    ),
    now()
  ),
  (
    uuid(),
    (
      SELECT
        id_user
      FROM
        User
      WHERE
        first_name = 'Bob'
    ),
    (
      SELECT
        id_scenario
      FROM
        Scenario
      WHERE
        name = 'Sample Scenario 2'
    ),
    (
      SELECT
        id_music
      FROM
        Music
      WHERE
        title = 'Sample Music 2'
    ),
    now()
  );

-- 9. Chèn dữ liệu vào bảng ScenarioSoundDetail
-- Lưu ý: id_sound và id_scenario phải khớp với các giá trị đã được chèn vào bảng Sound và Scenario trước đó
INSERT INTO
  ScenarioSoundDetail (
    id_concatenation,
    id_sound,
    id_scenario,
    location_x,
    location_y
  )
VALUES
  (
    uuid(),
    (
      SELECT
        id_sound
      FROM
        Sound
      WHERE
        title = 'Sound 1'
    ),
    (
      SELECT
        id_scenario
      FROM
        Scenario
      WHERE
        name = 'Sample Scenario 1'
    ),
    0.5,
    0.5
  ),
  (
    uuid(),
    (
      SELECT
        id_sound
      FROM
        Sound
      WHERE
        title = 'Sound 2'
    ),
    (
      SELECT
        id_scenario
      FROM
        Scenario
      WHERE
        name = 'Sample Scenario 2'
    ),
    0.75,
    0.25
  );

-- 10. Chèn dữ liệu vào bảng SoundTemplate
-- Lưu ý: id_sound và id_template phải khớp với các giá trị đã được chèn vào bảng Sound và Template trước đó
INSERT INTO
  SoundTemplate (id_sound_template, id_sound, id_template, volumn)
VALUES
  (
    uuid(),
    (
      SELECT
        id_sound
      FROM
        Sound
      WHERE
        title = 'Sound 1'
    ),
    (
      SELECT
        id_template
      FROM
        Template
      WHERE
        id_scenario = (
          SELECT
            id_scenario
          FROM
            Scenario
          WHERE
            name = 'Sample Scenario 1'
        )
    ),
    0.8
  ),
  (
    uuid(),
    (
      SELECT
        id_sound
      FROM
        Sound
      WHERE
        title = 'Sound 2'
    ),
    (
      SELECT
        id_template
      FROM
        Template
      WHERE
        id_scenario = (
          SELECT
            id_scenario
          FROM
            Scenario
          WHERE
            name = 'Sample Scenario 2'
        )
    ),
    0.6
  );

-- 11. Chèn dữ liệu vào bảng ScenarioMusicDetail
-- Lưu ý: id_scenario và id_music phải khớp với các giá trị đã được chèn vào bảng Scenario và Music trước đó
INSERT INTO
  ScenarioMusicDetail (id_concatenation, id_scenario, id_music)
VALUES
  (
    uuid(),
    (
      SELECT
        id_scenario
      FROM
        Scenario
      WHERE
        name = 'Sample Scenario 1'
    ),
    (
      SELECT
        id_music
      FROM
        Music
      WHERE
        title = 'Sample Music 1'
    )
  ),
  (
    uuid(),
    (
      SELECT
        id_scenario
      FROM
        Scenario
      WHERE
        name = 'Sample Scenario 2'
    ),
    (
      SELECT
        id_music
      FROM
        Music
      WHERE
        title = 'Sample Music 2'
    )
  );