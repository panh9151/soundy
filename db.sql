ALTER DATABASE Soundy CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
use Soundy;

-- ADD TABLE
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
  id_author VARCHAR(40) PRIMARY KEY default uuid(),
  name VARCHAR(255) not null UNIQUE,
  thumbnail VARCHAR(255)
);

-- Tạo bảng Type
CREATE TABLE Type (
  id_type VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  label VARCHAR(255) not null UNIQUE,
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
  title VARCHAR(255) NOT NULL,
  music_path VARCHAR(255) not null,
  last_updated DATETIME DEFAULT now(),
  created_at DATETIME DEFAULT now(),
  is_show ENUM("0", "1") DEFAULT "1",
  FOREIGN KEY (id_author) REFERENCES Author(id_author) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_type) REFERENCES Type(id_type) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tạo bảng Scenario
CREATE TABLE Scenario (
  id_scenario VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  name VARCHAR(255),
  img_path VARCHAR(255),
  set_free ENUM("0", "1") DEFAULT "1",
  free_time_start DATETIME,
  free_time_end DATETIME,
  type enum("day", "night", "rain") DEFAULT "day",
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
  FOREIGN KEY (id_type) REFERENCES Type(id_type) ON DELETE SET NULL ON UPDATE CASCADE 
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
  FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tạo bảng Template
CREATE TABLE Template (
  id_template VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_user VARCHAR(40) NOT NULL,
  id_scenario VARCHAR(40),
  id_music VARCHAR(40),
  last_updated DATETIME NOT NULL DEFAULT now(),
  music_volumn float default 0.5,
  FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE SET NULL ON UPDATE CASCADE
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
  FOREIGN KEY (id_sound) REFERENCES Sound(id_sound) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạo bảng SoundTemplate
CREATE TABLE SoundTemplate (
  id_sound_template VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_sound VARCHAR(40),
  id_template VARCHAR(40),
  volumn FLOAT not null default 0.5,
  FOREIGN KEY (id_sound) REFERENCES Sound(id_sound) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_template) REFERENCES Template(id_template) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạo bảng ScenarioMusicDetail
CREATE TABLE ScenarioMusicDetail (
  id_concatenation VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_scenario VARCHAR(40) NOT NULL,
  id_music VARCHAR(40) NOT NULL,
  is_default ENUM("0", "1") DEFAULT "0",
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_music) REFERENCES Music(id_music) ON DELETE CASCADE ON UPDATE CASCADE
);


-- TRIGGER
-- Trigger cho bảng Sound
DELIMITER $$
CREATE OR REPLACE TRIGGER trg_update_sound_time
BEFORE UPDATE ON Sound
FOR EACH ROW
BEGIN
    SET NEW.last_updated = NOW();
END $$
DELIMITER ;

-- Trigger cho bảng Scenario
DELIMITER $$
CREATE OR REPLACE TRIGGER trg_update_scenario_time
BEFORE UPDATE ON Scenario
FOR EACH ROW
BEGIN
    SET NEW.last_updated = NOW();
END $$
DELIMITER ;

-- Trigger cho bảng Music
DELIMITER $$
CREATE OR REPLACE TRIGGER trg_update_music_time
BEFORE UPDATE ON Music
FOR EACH ROW
BEGIN
    SET NEW.last_updated = NOW();
END $$
DELIMITER ;

-- Trigger cho bảng Template
DELIMITER $$
CREATE OR REPLACE TRIGGER trg_update_template_time
BEFORE UPDATE ON Template
FOR EACH ROW
BEGIN
    SET NEW.last_updated = NOW();
END $$
DELIMITER ;

-- Trigger cho bảng PeriodMembership
DELIMITER $$
CREATE OR REPLACE TRIGGER trg_update_membership_time
BEFORE UPDATE ON PeriodMembership
FOR EACH ROW
BEGIN
    SET NEW.last_updated = NOW();
END $$
DELIMITER ;

-- Trigger cho bảng User
DELIMITER $$
CREATE OR REPLACE TRIGGER trg_update_user_time
BEFORE UPDATE ON User
FOR EACH ROW
BEGIN
    SET NEW.last_updated = NOW();
END $$
DELIMITER ;

-- INSERT
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
    "123",
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
    "234",
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

----------------------------------------------------- PROCEDURE
------------------------- Delete
-- Delete Author -> music (id_author) -> null
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_author(
    IN p_id_author VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_author as id, name, thumbnail FROM Author
    WHERE id_author = p_id_author;

    -- Xóa bản ghi
    DELETE FROM Author
    WHERE id_author = p_id_author;
END //
-- CALL delete_author('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete Type
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_type(
    IN p_id_type VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_type as id, label, thumbnail from Type
    where id_type = p_id_type;
    
    -- Xóa bản ghi
    DELETE FROM Type
    WHERE id_type = p_id_type;
END //
-- CALL delete_type('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete User
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_user(
    IN p_id_user VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_user as id, first_name, last_name, email FROM User
    WHERE id_user = p_id_user;

    -- Xóa bản ghi
    DELETE FROM User
    WHERE id_user = p_id_user;
END //
-- CALL delete_user('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete Music
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_music(
    IN p_id_music VARCHAR(40)
)
BEGIN
    -- -- Lấy thông tin của bản ghi trước khi xóa
    -- SELECT id_music as id, title FROM Music
    -- WHERE id_music = p_id_music;

    -- Xóa bản ghi
    DELETE FROM Music
    WHERE id_music = p_id_music;
END //
-- CALL delete_music('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete Scenario
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_scenario(
    IN p_id_scenario VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_scenario as id, name, img_path, set_free, free_time_start, free_time_end, type, is_default, is_show 
    FROM Scenario
    WHERE id_scenario = p_id_scenario;

    -- Xóa bản ghi
    DELETE FROM Scenario
    WHERE id_scenario = p_id_scenario;
END //
-- CALL delete_scenario('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete Sound
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_sound(
    IN p_id_sound VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_sound as id, id_type, sound_path, thumbnail, title FROM Sound
    WHERE id_sound = p_id_sound;

    -- Xóa bản ghi
    DELETE FROM Sound
    WHERE id_sound = p_id_sound;
END //
-- CALL delete_sound('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete PeriodMembership
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE delete_period_membership(
--     IN p_id_membership VARCHAR(40)
-- )
-- BEGIN
--     -- Lấy thông tin của bản ghi trước khi xóa
--     SELECT id_membership as id, id_user, start, end, price, payment_method, is_paid FROM PeriodMembership
--     WHERE id_membership = p_id_membership;

--     -- Xóa bản ghi
--     DELETE FROM PeriodMembership
--     WHERE id_membership = p_id_membership;
-- END //
-- -- CALL delete_period_membership('ee6dbc5b-5c17-11ef-8672-000e1e909940');
-- DELIMITER ;


-- Delete Template
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_template(
    IN p_id_template VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_template as id, id_user, id_scenario, id_music, music_volumn FROM Template
    WHERE id_template = p_id_template;

    -- Xóa bản ghi
    DELETE FROM Template
    WHERE id_template = p_id_template;
END //
-- CALL delete_template('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete ScenarioSoundDetail
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_scenario_music_detail(
    IN p_id_concatenation VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_concatenation as id, id_scenario, id_music, is_default FROM ScenarioMusicDetail
    WHERE id_concatenation = p_id_concatenation;

    -- Xóa bản ghi
    DELETE FROM ScenarioMusicDetail
    WHERE id_concatenation = p_id_concatenation;
END //
-- CALL delete_scenario_music_detail('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete SoundTemplate
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_sound_template(
    IN p_id_sound_template VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_sound_template as id, id_sound, id_template, volumn FROM SoundTemplate
    WHERE id_sound_template = p_id_sound_template;

    -- Xóa bản ghi
    DELETE FROM SoundTemplate
    WHERE id_sound_template = p_id_sound_template;
END //
-- CALL delete_sound_template('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;


-- Delete ScenarioMusicDetail
DELIMITER //
CREATE OR REPLACE PROCEDURE delete_scenario_sound_detail(
    IN p_id_concatenation VARCHAR(40)
)
BEGIN
    -- Lấy thông tin của bản ghi trước khi xóa
    SELECT id_concatenation as id, id_sound, id_scenario, location_x, location_y, default_playing, default_volumn FROM ScenarioSoundDetail
    WHERE id_concatenation = p_id_concatenation;

    -- Xóa bản ghi
    DELETE FROM ScenarioSoundDetail
    WHERE id_concatenation = p_id_concatenation;
END //
-- CALL delete_scenario_sound_detail('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;



------------------------- Insert
-- Insert Author
/* Insert Author Full */
DELIMITER //
CREATE OR REPLACE PROCEDURE add_author(
    IN p_name VARCHAR(255),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    DECLARE v_id VARCHAR(40);
    SELECT id_author INTO v_id FROM Author WHERE name = p_name;

    IF v_id IS NOT NULL THEN
      -- Nếu name đã tồn tại, trả về thông tin của bản ghi đó
        SELECT id_author as id, name, thumbnail 
        FROM Author 
        WHERE id_author = v_id;
    ELSE
        -- Nếu name chưa tồn tại, tạo uuid và thêm mới và trả về id vừa tạo
        SET v_id = UUID();
        INSERT INTO Author (id_author, name, thumbnail)
        VALUES (v_id, p_name, p_thumbnail);

        SELECT v_id as id, p_name, p_thumbnail;
    END IF;
END //
-- CALL add_author('John Doe', 'path/to/thumbnail.jpg');
DELIMITER ;

/* Insert Author Minimalist */
DELIMITER //
CREATE OR REPLACE PROCEDURE add_author_minimalist(
    IN p_name VARCHAR(255),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    DECLARE v_id VARCHAR(40);
    SELECT id_author INTO v_id FROM Author WHERE name = p_name;

    IF v_id IS NOT NULL THEN
      -- Nếu name đã tồn tại, trả về thông tin của bản ghi đó
        SELECT id_author as id, name 
        FROM Author 
        WHERE id_author = v_id;
    ELSE
        -- Nếu name chưa tồn tại, tạo uuid và thêm mới và trả về id vừa tạo
        SET v_id = UUID();
        INSERT INTO Author (id_author, name)
        VALUES (v_id, p_name);

        SELECT v_id as id, p_name, null;
    END IF;
END //
-- CALL add_author_minimalist('Jane Doe');
DELIMITER ;


-- Insert Type
-- Insert Type Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_type(
    IN p_label VARCHAR(255),
    IN p_thumbnail VARCHAR(255),
    IN p_is_show ENUM("0", "1")
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Type (id_type, label, thumbnail, is_show)
    VALUES (id, p_label, p_thumbnail, p_is_show);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_type as id, label, thumbnail from Type
    where id_type = id;
END //
-- CALL add_type('Example Label', 'path/to/thumbnail.jpg', '1');
DELIMITER ;

-- Insert Type Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_type_minimalist(
    IN p_label VARCHAR(255)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Type (id_type, label)
    VALUES (id, p_label);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_type as id, label, thumbnail from Type
    where id_type = id;
END //
-- CALL add_type_minimalist('New Label');
DELIMITER ;


-- Insert User
-- Insert User Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_user(
    IN p_first_name VARCHAR(20),
    IN p_last_name VARCHAR(20),
    IN p_middle_name VARCHAR(20),
    IN p_role ENUM('user', 'admin'),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_avatar_path VARCHAR(255),
    IN p_phone VARCHAR(12),
    IN p_gender ENUM('male', 'female'),
    IN p_age INT,
    IN p_id_google VARCHAR(255),
    IN p_is_banned ENUM('0', '1'),
    IN p_token_reset VARCHAR(255),
    IN p_expired_token_reset BIGINT
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO User (id_user, first_name, last_name, middle_name, role, email, password, avatar_path, phone, gender, age, id_google, is_banned, token_reset, expired_token_reset)
    VALUES (id, p_first_name, p_last_name, p_middle_name, p_role, p_email, p_password, p_avatar_path, p_phone, p_gender, p_age, p_id_google, p_is_banned, p_token_reset, p_expired_token_reset);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_user as id, first_name, last_name, middle_name, role, email, avatar_path, phone, gender, age, id_google, is_banned, token_reset, expired_token_reset FROM User
    WHERE id_user = id;
END //
-- CALL add_user('John', 'Doe', 'Middle', 'user', 'john.doe@example.com', 'password123', 'path/to/avatar.jpg', '1234567890', 'male', 30, 'google_id_123', '0', 'reset_token', 1234567890);
DELIMITER ;

-- Insert User Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_user_minimalist(
    IN p_first_name VARCHAR(20),
    IN p_last_name VARCHAR(20),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO User (id_user, first_name, last_name, email, password)
    VALUES (id, p_first_name, p_last_name, p_email, p_password);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_user as id, first_name, last_name, email FROM User
    WHERE id_user = id;
END //
-- CALL add_user_minimalist('Jane', 'Doe', 'jane.doe@example.com', 'password456');
DELIMITER ;


-- Insert Music
-- Insert Music Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_music(
    IN p_id_author VARCHAR(40),
    IN p_id_type VARCHAR(40),
    IN p_title VARCHAR(255),
    IN p_music_path VARCHAR(255),
    IN p_is_show ENUM('0', '1')
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Music (id_music, id_author, id_type, title, music_path, is_show)
    VALUES (id, p_id_author, p_id_type, p_title, p_music_path, p_is_show);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_music as id, id_author, id_type, title, music_path, is_show FROM Music
    WHERE id_music = id;
END //
DELIMITER ;

-- Insert Music Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_music_minimalist(
    IN p_title VARCHAR(255),
    IN p_music_path VARCHAR(255)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Music (id_music, title, music_path)
    VALUES (id, p_title, p_music_path);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_music as id, title, music_path FROM Music
    WHERE id_music = id;
END //
-- CALL add_music_minimalist('New Music Title', 'path/to/music/file.mp3');
DELIMITER ;


-- Insert Scenario
-- Insert Scenario Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario(
    IN p_name VARCHAR(255),
    IN p_img_path VARCHAR(255),
    IN p_set_free ENUM('0', '1'),
    IN p_free_time_start DATETIME,
    IN p_free_time_end DATETIME,
    IN p_type ENUM('day', 'night', 'raining'),
    IN p_is_default ENUM('0', '1'),
    IN p_is_show ENUM('0', '1')
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Scenario (id_scenario, name, img_path, set_free, free_time_start, free_time_end, type, is_default, is_show)
    VALUES (id, p_name, p_img_path, p_set_free, p_free_time_start, p_free_time_end, p_type, p_is_default, p_is_show);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_scenario as id, name, img_path, type FROM Scenario
    WHERE id_scenario = id;
END //
DELIMITER ;

-- Insert Scenario Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_minimalist(
    IN p_name VARCHAR(255)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Scenario (id_scenario, name)
    VALUES (id, p_name);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_scenario as id, name FROM Scenario
    WHERE id_scenario = id;
END //
DELIMITER ;


-- Insert Sound
-- Insert Sound Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_sound(
    IN p_id_type VARCHAR(40),
    IN p_sound_path VARCHAR(255),
    IN p_thumbnail VARCHAR(255),
    IN p_title VARCHAR(255)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Sound (id_sound, id_type, sound_path, thumbnail, title)
    VALUES (id, p_id_type, p_sound_path, p_thumbnail, p_title);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_sound as id, id_type, sound_path, thumbnail, title FROM Sound
    WHERE id_sound = id;
END //
DELIMITER ;

-- Insert Sound Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_sound_minimalist(
    IN p_id_type VARCHAR(40),
    IN p_title VARCHAR(255)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Sound (id_sound, id_type, title)
    VALUES (id, p_id_type, p_title);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_sound as id, id_type, title FROM Sound
    WHERE id_sound = id;
END //
DELIMITER ;


-- Insert PeriodMembership
DELIMITER //
CREATE OR REPLACE PROCEDURE add_period_membership(
    IN p_id_user VARCHAR(40),
    IN p_start DATETIME,
    IN p_end DATETIME,
    IN p_price DOUBLE,
    IN p_payment_method VARCHAR(10),
    IN p_is_paid ENUM('paid', 'unpaid', 'returned', 'processing')
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO PeriodMembership (id_membership, id_user, start, end, price, payment_method, is_paid)
    VALUES (id, p_id_user, p_start, p_end, p_price, p_payment_method, p_is_paid);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_membership as id, id_user, start, end, price, payment_method, is_paid FROM PeriodMembership
    WHERE id_membership = id;
END //
DELIMITER ;


-- Insert Template
-- Insert Template Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_template(
    IN p_id_user VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40),
    IN p_music_volumn FLOAT
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Template (id_template, id_user, id_scenario, id_music, music_volumn)
    VALUES (id, p_id_user, p_id_scenario, p_id_music, p_music_volumn);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_template as id, id_user, id_scenario, id_music, music_volumn FROM Template
    WHERE id_template = id;
END //
DELIMITER ;

-- Insert Template Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_template_minimalist(
    IN p_id_user VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Template (id_template, id_user, id_scenario, id_music)
    VALUES (id, p_id_user, p_id_scenario, p_id_music);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_template as id, id_user, id_scenario, id_music FROM Template
    WHERE id_template = id;
END //
DELIMITER ;


-- Insert ScenarioSoundDetail
-- Insert ScenarioSoundDetail Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_sound_detail(
    IN p_id_sound VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_location_x FLOAT,
    IN p_location_y FLOAT,
    IN p_default_playing FLOAT,
    IN p_default_volumn FLOAT
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO ScenarioSoundDetail (id_concatenation, id_sound, id_scenario, location_x, location_y, default_playing, default_volumn)
    VALUES (id, p_id_sound, p_id_scenario, p_location_x, p_location_y, p_default_playing, p_default_volumn);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_concatenation as id, id_sound, id_scenario, location_x, location_y, default_playing, default_volumn FROM ScenarioSoundDetail
    WHERE id_concatenation = id;
END //
DELIMITER ;

-- Insert ScenarioSoundDetail Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_sound_detail_minimalist(
    IN p_id_sound VARCHAR(40),
    IN p_id_scenario VARCHAR(40)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO ScenarioSoundDetail (id_concatenation, id_sound, id_scenario)
    VALUES (id, p_id_sound, p_id_scenario);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_concatenation as id, id_sound, id_scenario FROM ScenarioSoundDetail
    WHERE id_concatenation = id;
END //
DELIMITER ;


-- Insert SoundTemplate
-- Insert SoundTemplate Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_sound_template(
    IN p_id_sound VARCHAR(40),
    IN p_id_template VARCHAR(40),
    IN p_volumn FLOAT
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO SoundTemplate (id_sound_template, id_sound, id_template, volumn)
    VALUES (id, p_id_sound, p_id_template, p_volumn);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_sound_template as id, id_sound, id_template, volumn FROM SoundTemplate
    WHERE id_sound_template = id;
END //
DELIMITER ;

-- Insert SoundTemplate Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_sound_template_minimalist(
    IN p_id_sound VARCHAR(40),
    IN p_id_template VARCHAR(40)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO SoundTemplate (id_sound_template, id_sound, id_template)
    VALUES (id, p_id_sound, p_id_template);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_sound_template as id, id_sound, id_template FROM SoundTemplate
    WHERE id_sound_template = id;
END //
DELIMITER ;


-- Insert ScenarioMusicDetail
-- Insert ScenarioMusicDetail Full
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_music_detail(
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40),
    IN p_is_default ENUM("0", "1")
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO ScenarioMusicDetail (id_concatenation, id_scenario, id_music, is_default)
    VALUES (id, p_id_scenario, p_id_music, p_is_default);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_concatenation as id, id_scenario, id_music, is_default FROM ScenarioMusicDetail
    WHERE id_concatenation = id;
END //
DELIMITER ;

-- Insert ScenarioMusicDetail Minimalist
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_music_detail_minimalist(
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO ScenarioMusicDetail (id_concatenation, id_scenario, id_music)
    VALUES (id, p_id_scenario, p_id_music);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_concatenation as id, id_scenario, id_music FROM ScenarioMusicDetail
    WHERE id_concatenation = id;
END //
DELIMITER ;



------------------------- Update
-- Update Author
-- Update Author Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_author_full(
    IN p_id_author VARCHAR(40),
    IN p_name VARCHAR(255),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    UPDATE Author
    SET name = p_name,
        thumbnail = p_thumbnail
    WHERE id_author = p_id_author;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_author as id, name, thumbnail FROM Author
    WHERE id_author = p_id_author;
END //
-- CALL update_author_full('3050b5aa-5c14-11ef-8672-000e1e909940', 'New Author Name', 'new/path/to/thumbnail.jpg');
DELIMITER ;


-- Update Author Name
DELIMITER //
CREATE OR REPLACE PROCEDURE update_author_name(
    IN p_id_author VARCHAR(40),
    IN p_name VARCHAR(255)
)
BEGIN
    UPDATE Author
    SET name = p_name
    WHERE id_author = p_id_author;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_author as id, name, thumbnail FROM Author
    WHERE id_author = p_id_author;
END //
-- CALL update_author_name('3050b5aa-5c14-11ef-8672-000e1e909940', 'Updated Author Name');
DELIMITER ;


-- Update Author Thumbnail
DELIMITER //
CREATE OR REPLACE PROCEDURE update_author_thumbnail(
    IN p_id_author VARCHAR(40),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    UPDATE Author
    SET thumbnail = p_thumbnail
    WHERE id_author = p_id_author;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_author as id, name, thumbnail FROM Author
    WHERE id_author = p_id_author;
END //
-- CALL update_author_thumbnail('3050b5aa-5c14-11ef-8672-000e1e909940', 'new/path/to/thumbnail.jpg');
DELIMITER ;


-- Update Type
-- Update Type Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_type_full(
    IN p_id_type VARCHAR(40),
    IN p_label VARCHAR(255),
    IN p_thumbnail VARCHAR(255),
    IN p_is_show ENUM("0", "1")
)
BEGIN
    UPDATE Type
    SET label = p_label,
        thumbnail = p_thumbnail,
        is_show = p_is_show
    WHERE id_type = p_id_type;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_type as id, label, thumbnail from Type
    where id_type = p_id_type;
END //
-- CALL update_type_full('3050b5aa-5c14-11ef-8672-000e1e909940', 'New Label', 'new/path/to/thumbnail.jpg', '1');
DELIMITER ;


-- Update Type Label
DELIMITER //
CREATE OR REPLACE PROCEDURE update_type_label(
    IN p_id_type VARCHAR(40),
    IN p_label VARCHAR(255)
)
BEGIN
    UPDATE Type
    SET label = p_label
    WHERE id_type = p_id_type;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_type as id, label, thumbnail from Type
    where id_type = p_id_type;
END //
-- CALL update_type_label('3050b5aa-5c14-11ef-8672-000e1e909940', 'New Label-test');
DELIMITER ;


-- Update Type Thumbnail
DELIMITER //
CREATE OR REPLACE PROCEDURE update_type_thumbnail(
    IN p_id_type VARCHAR(40),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    UPDATE Type
    SET thumbnail = p_thumbnail
    WHERE id_type = p_id_type;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_type as id, label, thumbnail from Type
    where id_type = p_id_type;
END //
-- CALL update_type_thumbnail('3050b5aa-5c14-11ef-8672-000e1e909940', 'New PATH-1');
DELIMITER ;


-- Update Type is_show
DELIMITER //
CREATE OR REPLACE PROCEDURE update_type_is_show(
    IN p_id_type VARCHAR(40),
    IN p_is_show ENUM("0", "1")
)
BEGIN
    UPDATE Type
    SET is_show = p_is_show
    WHERE id_type = p_id_type;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_type as id, label, thumbnail from Type
    where id_type = p_id_type;
END //
-- CALL update_type_is_show('3050b5aa-5c14-11ef-8672-000e1e909940', '0');
DELIMITER ;



-- Update User
-- Update User Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_full(
    IN p_id_user VARCHAR(40),
    IN p_first_name VARCHAR(20),
    IN p_last_name VARCHAR(20),
    IN p_middle_name VARCHAR(20),
    IN p_role ENUM('user', 'admin'),
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_avatar_path VARCHAR(255),
    IN p_phone VARCHAR(12),
    IN p_gender ENUM('male', 'female'),
    IN p_age INT,
    IN p_id_google VARCHAR(255),
    IN p_is_banned ENUM('0', '1'),
    IN p_token_reset VARCHAR(255),
    IN p_expired_token_reset BIGINT
)
BEGIN
    UPDATE User
    SET first_name = p_first_name,
        last_name = p_last_name,
        middle_name = p_middle_name,
        role = p_role,
        email = p_email,
        password = p_password,
        avatar_path = p_avatar_path,
        phone = p_phone,
        gender = p_gender,
        age = p_age,
        id_google = p_id_google,
        is_banned = p_is_banned,
        token_reset = p_token_reset,
        expired_token_reset = p_expired_token_reset
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, first_name, last_name, middle_name, role, email, avatar_path, phone, gender, age, id_google, is_banned, token_reset, expired_token_reset FROM User
    WHERE id_user = p_id_user;
END //
-- CALL update_user_full('3050b5aa-5c14-11ef-8672-000e1e909940', 'UpdatedFirstName', 'UpdatedLastName', 'UpdatedMiddleName', 'admin', 'updated.email@example.com', 'newpassword123', 'new/path/to/avatar.jpg', '0987654321', 'female', 35, 'new_google_id_456', '1', 'new_reset_token', 2345678901);
DELIMITER ;


-- Update User Name
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_first_last_name(
    IN p_id_user VARCHAR(40),
    IN p_first_name VARCHAR(20),
    IN p_last_name VARCHAR(20)
)
BEGIN
    UPDATE User
    SET first_name = p_first_name,
        last_name = p_last_name
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, first_name, last_name FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User middle_name
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_middle_name(
    IN p_id_user VARCHAR(40),
    IN p_middle_name VARCHAR(20)
)
BEGIN
    UPDATE User
    SET middle_name = p_middle_name
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, middle_name FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Role
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_role(
    IN p_id_user VARCHAR(40),
    IN p_role ENUM('user', 'admin')
)
BEGIN
    UPDATE User
    SET role = p_role
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, role FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Email
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_email(
    IN p_id_user VARCHAR(40),
    IN p_email VARCHAR(255)
)
BEGIN
    UPDATE User
    SET email = p_email
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, email FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Password
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_password(
    IN p_id_user VARCHAR(40),
    IN p_password VARCHAR(255)
)
BEGIN
    UPDATE User
    SET password = p_password
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, password FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Avatar
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_avatar(
    IN p_id_user VARCHAR(40),
    IN p_avatar_path VARCHAR(255)
)
BEGIN
    UPDATE User
    SET avatar_path = p_avatar_path
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, avatar_path FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Phone
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_phone(
    IN p_id_user VARCHAR(40),
    IN p_phone VARCHAR(12)
)
BEGIN
    UPDATE User
    SET phone = p_phone
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, phone FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Gender
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_gender(
    IN p_id_user VARCHAR(40),
    IN p_gender ENUM('male', 'female')
)
BEGIN
    UPDATE User
    SET gender = p_gender
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, gender FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User Age
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_age(
    IN p_id_user VARCHAR(40),
    IN p_age INT
)
BEGIN
    UPDATE User
    SET age = p_age
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, age FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User ID Google
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_id_google(
    IN p_id_user VARCHAR(40),
    IN p_id_google VARCHAR(255)
)
BEGIN
    UPDATE User
    SET id_google = p_id_google
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, id_google FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Update User is_banned
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_is_banned(
    IN p_id_user VARCHAR(40),
    IN p_is_banned ENUM('0', '1')
)
BEGIN
    UPDATE User
    SET is_banned = p_is_banned
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_user as id, is_banned FROM User
    WHERE id_user = p_id_user;
END //
DELIMITER ;

-- Cập nhật token reset
DELIMITER //
CREATE OR REPLACE PROCEDURE update_user_token_reset(
    IN p_id_user VARCHAR(40),
    IN p_token_reset VARCHAR(255),
    IN p_expired_token_reset BIGINT
)
BEGIN
    UPDATE User
    SET token_reset = p_token_reset,
    expired_token_reset = p_expired_token_reset
    WHERE id_user = p_id_user;

    -- Lấy giá trị của bản ghi đã cập nhật
    -- SELECT id_user as id, token_reset, expired_token_reset FROM User
    -- WHERE id_user = p_id_user;
END //
DELIMITER ;


-- Update Music
-- Update Music Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_music_full(
    IN p_id_music VARCHAR(40),
    IN p_id_author VARCHAR(40),
    IN p_id_type VARCHAR(40),
    IN p_title VARCHAR(255),
    IN p_music_path VARCHAR(255),
    IN p_is_show ENUM("0", "1")
)
BEGIN
    UPDATE Music
    SET id_author = p_id_author,
        id_type = p_id_type,
        title = p_title,
        music_path = p_music_path,
        is_show = p_is_show
    WHERE id_music = p_id_music;

    -- Trả về thông tin của bản ghi vừa cập nhật
    SELECT id_music as id, id_author, id_type, title, music_path, is_show FROM Music
    WHERE id_music = p_id_music;
END //
-- CALL update_music_full('existing-music-id', 'new-author-id', 'new-type-id', 'New Title', 'new/path/to/music.mp3', '1');
DELIMITER ;


-- Update Music Author
DELIMITER //
CREATE OR REPLACE PROCEDURE update_music_author(
    IN p_id_music VARCHAR(40),
    IN p_id_author VARCHAR(40)
)
BEGIN
    UPDATE Music
    SET id_author = p_id_author
    WHERE id_music = p_id_music;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_music as id, id_author FROM Music
    WHERE id_music = p_id_music;
END //
DELIMITER ;


-- Update Music Type
DELIMITER //
CREATE OR REPLACE PROCEDURE update_music_type(
    IN p_id_music VARCHAR(40),
    IN p_id_type VARCHAR(40)
)
BEGIN
    UPDATE Music
    SET id_type = p_id_type
    WHERE id_music = p_id_music;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_music as id, id_type FROM Music
    WHERE id_music = p_id_music;
END //
DELIMITER ;

-- Update Music Title
DELIMITER //
CREATE OR REPLACE PROCEDURE update_music_title(
    IN p_id_music VARCHAR(40),
    IN p_title VARCHAR(255)
)
BEGIN
    UPDATE Music
    SET title = p_title
    WHERE id_music = p_id_music;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_music as id, title FROM Music
    WHERE id_music = p_id_music;
END //
DELIMITER ;

-- Update Music Path
DELIMITER //
CREATE OR REPLACE PROCEDURE update_music_path(
    IN p_id_music VARCHAR(40),
    IN p_music_path VARCHAR(255)
)
BEGIN
    UPDATE Music
    SET music_path = p_music_path
    WHERE id_music = p_id_music;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_music as id, music_path FROM Music
    WHERE id_music = p_id_music;
END //
DELIMITER ;

-- Update Music is_show
DELIMITER //
CREATE OR REPLACE PROCEDURE update_music_is_show(
    IN p_id_music VARCHAR(40),
    IN p_is_show ENUM('0', '1')
)
BEGIN
    UPDATE Music
    SET is_show = p_is_show
    WHERE id_music = p_id_music;

    -- Lấy giá trị của bản ghi đã cập nhật
    SELECT id_music as id, is_show FROM Music
    WHERE id_music = p_id_music;
END //
DELIMITER ;



-- Update Scenario
-- Update Scenario Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_all(
    IN p_id_scenario VARCHAR(40),
    IN p_name VARCHAR(255),
    IN p_img_path VARCHAR(255),
    IN p_set_free ENUM('0', '1'),
    IN p_free_time_start DATETIME,
    IN p_free_time_end DATETIME,
    IN p_type ENUM('day', 'night', 'raining'),
    IN p_is_default ENUM('0', '1'),
    IN p_is_show ENUM('0', '1')
)
BEGIN
    UPDATE Scenario
    SET name = p_name,
        img_path = p_img_path,
        set_free = p_set_free,
        free_time_start = p_free_time_start,
        free_time_end = p_free_time_end,
        type = p_type,
        is_default = p_is_default,
        is_show = p_is_show
    WHERE id_scenario = p_id_scenario;
    
    -- Trả về giá trị đã cập nhật
    SELECT id_scenario as id, name, img_path, set_free, free_time_start, free_time_end, type, is_default, is_show 
    FROM Scenario
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;


-- Update Scenario Name
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_name(
    IN p_id_scenario VARCHAR(40),
    IN p_name VARCHAR(255)
)
BEGIN
    UPDATE Scenario
    SET name = p_name
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;

-- Update Scenario img_path
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_img_path(
    IN p_id_scenario VARCHAR(40),
    IN p_img_path VARCHAR(255)
)
BEGIN
    UPDATE Scenario
    SET img_path = p_img_path
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;

-- Update Scenario set_free
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_set_free(
    IN p_id_scenario VARCHAR(40),
    IN p_set_free ENUM('0', '1')
)
BEGIN
    UPDATE Scenario
    SET set_free = p_set_free
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;

-- Update scenario free_time 
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_free_time(
    IN p_id_scenario VARCHAR(40),
    IN p_free_time_start DATETIME,
    IN p_free_time_end DATETIME
)
BEGIN
    UPDATE Scenario
    SET free_time_start = p_free_time_start,
        free_time_end = p_free_time_end
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;

-- Update Scenario Type
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_type(
    IN p_id_scenario VARCHAR(40),
    IN p_type ENUM('day', 'night', 'raining')
)
BEGIN
    UPDATE Scenario
    SET type = p_type
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;

-- Update Scenario is_default
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_is_default(
    IN p_id_scenario VARCHAR(40),
    IN p_is_default ENUM('0', '1')
)
BEGIN
    UPDATE Scenario
    SET is_default = p_is_default
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;

-- Update Scenario is_show
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_is_show(
    IN p_id_scenario VARCHAR(40),
    IN p_is_show ENUM('0', '1')
)
BEGIN
    UPDATE Scenario
    SET is_show = p_is_show
    WHERE id_scenario = p_id_scenario;
END //
DELIMITER ;


-- Update Sound
-- Update Sound Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_all(
    IN p_id_sound VARCHAR(40),
    IN p_id_type VARCHAR(40),
    IN p_sound_path VARCHAR(255),
    IN p_thumbnail VARCHAR(255),
    IN p_title VARCHAR(255)
)
BEGIN
    UPDATE Sound
    SET id_type = p_id_type,
        sound_path = p_sound_path,
        thumbnail = p_thumbnail,
        title = p_title
    WHERE id_sound = p_id_sound;
    
    -- Trả về giá trị đã cập nhật
    SELECT id_sound as id, id_type, sound_path, thumbnail, title FROM Sound
    WHERE id_sound = p_id_sound;
END //
DELIMITER ;


-- Update Sound sound_path
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_path(
    IN p_id_sound VARCHAR(40),
    IN p_sound_path VARCHAR(255)
)
BEGIN
    UPDATE Sound
    SET sound_path = p_sound_path
    WHERE id_sound = p_id_sound;
END //
DELIMITER ;

-- Update SOund Thumbnail
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_thumbnail(
    IN p_id_sound VARCHAR(40),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    UPDATE Sound
    SET thumbnail = p_thumbnail
    WHERE id_sound = p_id_sound;
END //
DELIMITER ;

-- Update SOund Title
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_title(
    IN p_id_sound VARCHAR(40),
    IN p_title VARCHAR(255)
)
BEGIN
    UPDATE Sound
    SET title = p_title
    WHERE id_sound = p_id_sound;
END //
DELIMITER ;

-- Update Sound id_type
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_id_type(
    IN p_id_sound VARCHAR(40),
    IN p_id_type VARCHAR(40)
)
BEGIN
    UPDATE Sound
    SET id_type = p_id_type
    WHERE id_sound = p_id_sound;
END //
DELIMITER ;


-- Update PeriodMembership status
DELIMITER //
CREATE OR REPLACE PROCEDURE update_period_membership_is_paid(
    IN p_id_membership VARCHAR(40),
    IN p_is_paid ENUM('paid', 'unpaid', 'returned', 'processing')
)
BEGIN
    UPDATE PeriodMembership
    SET is_paid = p_is_paid
    WHERE id_membership = p_id_membership;
END //
DELIMITER ;


-- Update Template
-- Update Template Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_template_all(
    IN p_id_template VARCHAR(40),
    IN p_id_user VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40),
    IN p_music_volumn FLOAT
)
BEGIN
    UPDATE Template
    SET id_user = p_id_user,
        id_scenario = p_id_scenario,
        id_music = p_id_music,
        music_volumn = p_music_volumn
    WHERE id_template = p_id_template;
END //
DELIMITER ;


-- Update Template id_user
DELIMITER //
CREATE OR REPLACE PROCEDURE update_template_user(
    IN p_id_template VARCHAR(40),
    IN p_id_user VARCHAR(40)
)
BEGIN
    UPDATE Template
    SET id_user = p_id_user
    WHERE id_template = p_id_template;
END //
DELIMITER ;


-- Update Template id_scenario
DELIMITER //
CREATE OR REPLACE PROCEDURE update_template_scenario(
    IN p_id_template VARCHAR(40),
    IN p_id_scenario VARCHAR(40)
)
BEGIN
    UPDATE Template
    SET id_scenario = p_id_scenario
    WHERE id_template = p_id_template;
END //
DELIMITER ;


-- Update template id_music
DELIMITER //
CREATE OR REPLACE PROCEDURE update_template_music(
    IN p_id_template VARCHAR(40),
    IN p_id_music VARCHAR(40)
)
BEGIN
    UPDATE Template
    SET id_music = p_id_music
    WHERE id_template = p_id_template;
END //
DELIMITER ;



-- Update Template music_volumn
DELIMITER //
CREATE OR REPLACE PROCEDURE update_template_music_volumn(
    IN p_id_template VARCHAR(40),
    IN p_music_volumn FLOAT
)
BEGIN
    UPDATE Template
    SET music_volumn = p_music_volumn
    WHERE id_template = p_id_template;
END //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE update_template_music(
    IN p_id_template VARCHAR(40),
    IN p_id_music VARCHAR(40)
)
BEGIN
    UPDATE Template
    SET id_music = p_id_music
    WHERE id_template = p_id_template;
END //
DELIMITER ;



-- Update ScenarioSoundDetail
-- Update ScenarioSoundDetail Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_all(
    IN p_id_concatenation VARCHAR(40),
    IN p_id_sound VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_location_x FLOAT,
    IN p_location_y FLOAT,
    IN p_default_playing FLOAT,
    IN p_default_volumn FLOAT
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET id_sound = p_id_sound,
        id_scenario = p_id_scenario,
        location_x = p_location_x,
        location_y = p_location_y,
        default_playing = p_default_playing,
        default_volumn = p_default_volumn
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;


-- Update ScenarioSoundDetail id_sound
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_sound(
    IN p_id_concatenation VARCHAR(40),
    IN p_id_sound VARCHAR(40)
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET id_sound = p_id_sound
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;


-- Update ScenarioSoundDetail id_scenario
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_scenario(
    IN p_id_concatenation VARCHAR(40),
    IN p_id_scenario VARCHAR(40)
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET id_scenario = p_id_scenario
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;

-- Update ScenarioSoundDetail location_x
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_location_x(
    IN p_id_concatenation VARCHAR(40),
    IN p_location_x FLOAT
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET location_x = p_location_x
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;

-- Update ScenarioSoundDetail location_y
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_location_y(
    IN p_id_concatenation VARCHAR(40),
    IN p_location_y FLOAT
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET location_y = p_location_y
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;

-- Update ScenarioSoundDetail default_playing
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_default_playing(
    IN p_id_concatenation VARCHAR(40),
    IN p_default_playing FLOAT
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET default_playing = p_default_playing
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;

-- Update ScenarioSoundDetail default_volumn
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_default_volumn(
    IN p_id_concatenation VARCHAR(40),
    IN p_default_volumn FLOAT
)
BEGIN
    UPDATE ScenarioSoundDetail
    SET default_volumn = p_default_volumn
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;


-- Update SoundTemplate
-- Update SoundTemplate Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_template_all(
    IN p_id_sound_template VARCHAR(40),
    IN p_id_sound VARCHAR(40),
    IN p_id_template VARCHAR(40),
    IN p_volumn FLOAT
)
BEGIN
    UPDATE SoundTemplate
    SET id_sound = p_id_sound,
        id_template = p_id_template,
        volumn = p_volumn
    WHERE id_sound_template = p_id_sound_template;
    
    -- Trả về giá trị đã cập nhật
    SELECT id_sound_template as id, id_sound, id_template, volumn FROM SoundTemplate
    WHERE id_sound_template = p_id_sound_template;
END //
DELIMITER ;
-- Update SoundTemplate id_sound
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_template_sound(
    IN p_id_sound_template VARCHAR(40),
    IN p_id_sound VARCHAR(40)
)
BEGIN
    UPDATE SoundTemplate
    SET id_sound = p_id_sound
    WHERE id_sound_template = p_id_sound_template;
END //
DELIMITER ;


-- Update SoundTemplate id_template
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_template_template(
    IN p_id_sound_template VARCHAR(40),
    IN p_id_template VARCHAR(40)
)
BEGIN
    UPDATE SoundTemplate
    SET id_template = p_id_template
    WHERE id_sound_template = p_id_sound_template;
END //
DELIMITER ;


-- Update SoundTemplate Volumn
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_template_volumn(
    IN p_id_sound_template VARCHAR(40),
    IN p_volumn FLOAT
)
BEGIN
    UPDATE SoundTemplate
    SET volumn = p_volumn
    WHERE id_sound_template = p_id_sound_template;
END //
DELIMITER ;


-- Update ScenarioMusicDetail
-- Update ScenarioMusicDetail Full
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_music_detail_full(
    IN p_id_concatenation VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40),
    IN p_is_default ENUM("0", "1")
)
BEGIN
    UPDATE ScenarioMusicDetail
    SET id_scenario = p_id_scenario,
        id_music = p_id_music,
        is_default = p_is_default
    WHERE id_concatenation = p_id_concatenation;

    -- Trả về thông tin của bản ghi vừa cập nhật
    SELECT id_concatenation as id, id_scenario, id_music, is_default FROM ScenarioMusicDetail
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;


-- Update ScenarioMusicDetail scenario_id 
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_music_detail_scenario(
    IN p_id_concatenation VARCHAR(40),
    IN p_id_scenario VARCHAR(40)
)
BEGIN
    UPDATE ScenarioMusicDetail
    SET id_scenario = p_id_scenario
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;


-- Update ScenarioMusicDetail id_music
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_music_detail_music(
    IN p_id_concatenation VARCHAR(40),
    IN p_id_music VARCHAR(40)
)
BEGIN
    UPDATE ScenarioMusicDetail
    SET id_music = p_id_music
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;


-- Update ScenarioMusicDetail is_default
DELIMITER //
CREATE OR REPLACE PROCEDURE update_scenario_music_detail_is_default(
    IN p_id_concatenation VARCHAR(40),
    IN p_is_default ENUM("0", "1")
)
BEGIN
    UPDATE ScenarioMusicDetail
    SET is_default = p_is_default
    WHERE id_concatenation = p_id_concatenation;
END //
DELIMITER ;