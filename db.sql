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
  id_author VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  thumbnail VARCHAR(255)
);

-- Tạo bảng Type
CREATE TABLE Type (
  id_type VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  label VARCHAR(255) NOT NULL UNIQUE,
  thumbnail VARCHAR(255),
  _index integer default 0
);

-- Tạo bảng User
CREATE TABLE User (
  id_user VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  first_name VARCHAR(20) NOT NULL,
  last_name VARCHAR(20) NOT NULL,
  middle_name VARCHAR(20),
  role enum("user", "admin") NOT NULL DEFAULT "user",
  email varchar(255) NOT NULL,
  password varchar(255) NOT NULL,
  avatar_path VARCHAR(255),
  phone VARCHAR(12),
  gender ENUM('male', 'female'),
  age INT,
  id_google VARCHAR(255) UNIQUE,
  is_banned ENUM("0", "1") DEFAULT "0",
  last_updated DATETIME DEFAULT NOW(),
  created_date DATETIME DEFAULT NOW(),
  token_reset VARCHAR(255),
  expired_token_reset BIGINT
);

-- Tạo bảng Music
CREATE TABLE Music (
  id_music VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_author VARCHAR(40),
  id_type VARCHAR(40),
  title VARCHAR(255) NOT NULL,
  music_path VARCHAR(255) NOT NULL,
  is_free enum("0", "1") DEFAULT "1",
  is_show enum("0", "1") DEFAULT "1",
  _index INTEGER DEFAULT 0, 
  last_updated DATETIME DEFAULT NOW(),
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (id_author) REFERENCES Author(id_author) ON DELETE SET NULL ON UPDATE CASCADE,
  FOREIGN KEY (id_type) REFERENCES Type(id_type) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Tạo bảng Scenario
CREATE TABLE Scenario (
  id_scenario VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  name VARCHAR(255) NOT NULL,
  img_path VARCHAR(255) NOT NULL,
  day_url varchar(255),
  night_url varchar(255),
  rain_day_url varchar(255),
  rain_night_url varchar(255),
  is_free ENUM("0", "1") DEFAULT "1",
  free_time_start DATETIME,
  free_time_end DATETIME,
  _index INTEGER NOT NULL DEFAULT 0,
  is_show ENUM("0", "1") DEFAULT "1",
  last_updated DATETIME DEFAULT NOW(),
  created_at DATETIME DEFAULT NOW()
);

-- Tạo bảng Sound
CREATE TABLE Sound (
  id_sound VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_type VARCHAR(40),
  sound_path VARCHAR(255) NOT NULL,
  thumbnail VARCHAR(255),
  title VARCHAR(255) NOT NULL,
  is_free enum("0", "1") DEFAULT "1",
  is_show enum("0", "1") DEFAULT "1",
  last_updated DATETIME DEFAULT NOW(),
  created_at DATETIME DEFAULT NOW(),
  _index INTEGER DEFAULT 0, 
  FOREIGN KEY (id_type) REFERENCES Type(id_type) ON DELETE SET NULL ON UPDATE CASCADE 
);

-- Tạo bảng PeriodMembership
CREATE TABLE PeriodMembership (
  id_membership VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_user VARCHAR(40),
  start DATETIME NOT NULL,
  end DATETIME NOT NULL,
  price DOUBLE NOT NULL,
  payment_method VARCHAR(10) NOT NULL,
  is_paid ENUM("paid", "unpaid", "returned") DEFAULT "unpaid",
  last_updated DATETIME NOT NULL DEFAULT NOW(),
  created_date DATETIME NOT NULL DEFAULT NOW(),
  FOREIGN KEY (id_user) REFERENCES User(id_user) ON DELETE NO ACTION ON UPDATE CASCADE
);

-- Tạo bảng Template
CREATE TABLE Template (
  id_template VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_user VARCHAR(40) NOT NULL,
  id_scenario VARCHAR(40),
  id_music VARCHAR(40),
  last_updated DATETIME NOT NULL DEFAULT NOW(),
  music_volumn float DEFAULT 0.5,
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
  default_volumn float DEFAULT 0.5,
  FOREIGN KEY (id_sound) REFERENCES Sound(id_sound) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_scenario) REFERENCES Scenario(id_scenario) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạo bảng SoundTemplate
CREATE TABLE SoundTemplate (
  id_sound_template VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_sound VARCHAR(40),
  id_template VARCHAR(40),
  volumn FLOAT NOT NULL DEFAULT 0.5,
  FOREIGN KEY (id_sound) REFERENCES Sound(id_sound) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (id_template) REFERENCES Template(id_template) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Tạo bảng ScenarioMusicDetail
CREATE TABLE ScenarioMusicDetail (
  id_concatenation VARCHAR(40) PRIMARY KEY DEFAULT uuid(),
  id_scenario VARCHAR(40) NOT NULL,
  id_music VARCHAR(40) NOT NULL,
  default_volumn float DEFAULT 0.5,
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
-- Dữ liệu cho bảng Author
INSERT INTO Author (id_author, name, thumbnail) VALUES
('a1', 'John Williams', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1724748092/ctaznenblqlcghxvkwsr.svg'),
('a2', 'Hans Zimmer', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1724748092/ctaznenblqlcghxvkwsr.svg'),
('a3', 'Ennio Morricone', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1724748092/ctaznenblqlcghxvkwsr.svg');

-- Dữ liệu cho bảng Type
INSERT INTO Type (id_type, label, thumbnail) VALUES
('t1', 'Chill', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1724748092/ctaznenblqlcghxvkwsr.svg'),
('t2', 'Sleepy', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1724748092/tyamdofuuhurpufqdmlk.svg'),
('t3', 'Jazzy', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1724748092/kuh1yfj6z98ddf0mf8py.svg'),
('t4', 'Living', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725111763/soundy_svg/r96ywyqexyosmibx8xib.svg'),
('t5', 'Weather', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725112122/soundy_svg/dybs8qulxsunmnem1tkr.svg'),
('t6', 'Animal', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725111763/soundy_svg/lmakmdkbzaijb2o2v6iv.svg');

-- Dữ liệu cho bảng User
INSERT INTO User (id_user, first_name, last_name, middle_name, role, email, password, avatar_path, phone, gender, age, id_google, is_banned, last_updated, created_date, token_reset, expired_token_reset) VALUES
('u1', 'Alice', 'Smith', 'Marie', 'user', 'anhpt2611@gmail.com', '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2', 'https://example.com/avatars/alice.jpg', '1234567890', 'female', 30, 'google_id_1', '0', NOW(), NOW(), NULL, NULL),
('u2', 'Bob', 'Johnson', NULL, 'admin', 'panh9151@gmail.com', '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2', 'https://example.com/avatars/bob.jpg', '0987654321', 'male', 45, 'google_id_2', '0', NOW(), NOW(), NULL, NULL),
('u3', 'Bob', 'Johnson', NULL, 'user', 'panh91511@gmail.com', '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2', 'https://example.com/avatars/bob.jpg', '0987654322', 'male', 45, 'google_id_3', '0', NOW(), NOW(), NULL, NULL),
('u4', 'Bob', 'Johnson', NULL, 'user', 'panh915111@gmail.com', '$2a$12$FuDE3q6FuHB1wwrN9OACCu1rS0R67uMVDkuYrB5iqhjwesgt8YhK2', 'https://example.com/avatars/bob.jpg', '0987654320', 'male', 45, 'google_id_4', '1', NOW(), NOW(), NULL, NULL);

-- Dữ liệu cho bảng Music
INSERT INTO Music (id_music, id_author, id_type, title, music_path, last_updated, created_at, is_show, is_free) VALUES
('m1', "a1", 't2', 'Sleepy Song No.1', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204060/soundy/qgfkrswndgrjdtwl8dka.mp3', NOW(), NOW(), "1", "1"),
('m2', null, 't2', 'Sleepy Song No.2', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204058/soundy/aafpi79d3rkayclhcjdv.mp3', NOW(), NOW(), "1", "1"),
('m3', null, 't2', 'Sleepy Song No.3', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204051/soundy/p481ggerb6zh8uoecjbx.mp3', NOW(), NOW(), "1", "1"),
('m4', null, 't2', 'Sleepy Song No.4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204051/soundy/bw3kopvwczpbeq7ckfhe.mp3', NOW(), NOW(), "1", "0"),
('m5', "a2", 't3', 'Jazzy Song no.1', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204060/soundy/qgfkrswndgrjdtwl8dka.mp3', NOW(), NOW(), "1", "1"),
('m6', null, 't3', 'Jazzy Song no.2', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204432/soundy/xvsd1a4yrkqxpbtfmrcy.mp3', NOW(), NOW(), "1", "1"),
('m7', null, 't3', 'Jazzy Song no.3', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204442/soundy/ohbftyj43q06odn0ipyg.mp3', NOW(), NOW(), "1", "1"),
('m8', "a3", 't1', 'Chilling Song no.1', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204547/soundy/qif0km1gtcvzjjcv8jyq.mp3', NOW(), NOW(), "0", "0"),
('m9', "a1", 't1', 'Chilling Song no.2', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204546/soundy/y74dybfjcblgn2nmbcsn.mp3', NOW(), NOW(), "0", "0"),
('m10', "a1", 't1', 'Chilling Song no.3', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725204546/soundy/y1w8rlxp6gn205yjx2gu.mp3', NOW(), NOW(), "0", "0");

-- Dữ liệu cho bảng Scenario
INSERT INTO Scenario (id_scenario, name, img_path, is_free, free_time_start, free_time_end, last_updated, created_at, is_show, day_url, night_url, rain_day_url, rain_night_url) VALUES
('s1', 'Christmas Chill Vibes', "https://res.cloudinary.com/dmiaubxsm/image/upload/v1725540268/nptbq71tromurypjgbhr.png", '1', '2024-08-20 06:00:00', '2030-10-20 09:00:00', NOW(), NOW(), '1','https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558059/g2h2rpapunvic0oqjfgv.mp4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558055/wx2szxdiikpm9cj0tbwb.mp4', "https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558058/ffbfjecd6ap1aqf8ijlk.mp4", "https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558058/kfxvglgwv5i6hilt1avu.mp4"),
('s2', 'New York', "https://res.cloudinary.com/dmiaubxsm/image/upload/v1725540268/x0sw0w1nfgxyyxh0ofo3.png", '0', '2024-08-20 20:00:00', '2030-10-21 00:00:00', NOW(), NOW(), '1', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558416/xlnnz0ylhu7fjksa414u.mp4', "https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558414/kvauorugcwjqmecwqmvh.mp4", "https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558425/pqrnylh68vr6hjcogaik.mp4", 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725558422/ivcri4wwfznold0gvztk.mp4');

-- Dữ liệu cho bảng Sound
INSERT INTO Sound (id_sound, id_type, sound_path, thumbnail, title, last_updated, created_at) VALUES
('s1', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067225/soundy/n4aleq9jhmeqtu557h98.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068094/soundy_svg/pp6dovv2xckwjsnh2kfk.svg', 'Light Rain', NOW(), NOW()),
('s2', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067257/soundy/d7fcubikm0xei7aue4on.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069542/soundy_svg/uknu7sjvaqit1iburxlw.svg', 'Steady Rain', NOW(), NOW()),
('s3', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067297/soundy/mvya0dsr8vwrgxm3upnm.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069542/soundy_svg/bdqtyzydvu8hjjcbrmyy.svg', 'Heavy Rain', NOW(), NOW()),
('s4', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067331/soundy/qcqsf4b3oxloto0ra2ur.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068103/soundy_svg/uyrzh0solth9g7nyuhe7.svg', 'Thunder Rain', NOW(), NOW()),
('s5', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067117/soundy/kaddjcbo3n4x06jkhdcb.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069151/soundy_svg/wltknrrojv0378yguyd9.svg', 'Waterfall', NOW(), NOW()),
('s6', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067056/soundy/crkipk1iodvrkgwunnai.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068101/soundy_svg/zpqowvxie7gvzkygugrq.svg', 'Stream', NOW(), NOW()),
('s7', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067613/soundy/pk0yyuihipud2drn6xxi.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069150/soundy_svg/lojm4cb2hleo8myg68yk.svg', 'Water Drop', NOW(), NOW()),
('s8', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066158/soundy/fyuok5ymplhffwmpc38l.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068103/soundy_svg/idvswtkdxae3tlyxi6z7.svg', 'Lake', NOW(), NOW()),
('s9', 't6', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066153/soundy/pr0n1h09vetscaf1e3ds.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068094/soundy_svg/njko7j4ev8rtzpqxwsds.svg', 'Birdsong', NOW(), NOW()),
('s10', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066154/soundy/etbdqzezqkazvvqzdvc4.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068102/soundy_svg/tr1oeab2udhhm5j82aog.svg', 'Beach', NOW(), NOW()),
('s11', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066154/soundy/d3cfbxtxkpqaukudmqzf.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069149/soundy_svg/pz5bddi9mg5p60x4jpsu.svg', 'Wind Chimes', NOW(), NOW()),
('s12', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066154/soundy/ueqpc4u5ezapsgu1ynhc.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068104/soundy_svg/pdanifdp7hifilcnuyka.svg', 'Wind', NOW(), NOW()),
('s13', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066154/soundy/cachzhyi0kdlfra3hld9.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068094/soundy_svg/wfxup5ndtd0nve7l0yl6.svg', 'Campfire', NOW(), NOW()),
('s14', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066153/soundy/sgi8ylm68addbmvti1bi.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069149/soundy_svg/im5cifbfqx54a8rpqtje.svg', 'Construction', NOW(), NOW()),
('s15', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066153/soundy/m7unhumnphxaiwy2byyc.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068102/soundy_svg/i1uuwcvk4a2sslrire2t.svg', 'People talking', NOW(), NOW()),
('s16', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066155/soundy/bu191vlrgggfetiomtfs.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069680/soundy_svg/ts8x1uajq5squvetir9c.svg', 'Forest', NOW(), NOW()),
('s17', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066155/soundy/ldu6b1vgh0losny6dm1q.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068102/soundy_svg/zvsc5uclddu33xc3pga8.svg', 'Window rain', NOW(), NOW()),
('s18', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066152/soundy/vbnr81cyyjr3akytkgik.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068102/soundy_svg/exbpznpdogqudwgidern.svg', 'Keyboards', NOW(), NOW()),
('s19', 't6', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066152/soundy/sngdqek7nua49z0uubyg.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069149/soundy_svg/owj0iqdlplqpqs3dvzlp.svg', 'Cricket', NOW(), NOW()),
('s20', 't6', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725066154/soundy/ll6pbpwgjmcr5hzdbbyz.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069149/soundy_svg/dgbv3r7nzzos0a7atfvd.svg', 'Frog', NOW(), NOW()),
('s21', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725067483/soundy/sct8fggrvka6iy3zbwtq.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725069150/soundy_svg/sdvwvz9s5mcb6j62p3c9.svg', 'Thunder', NOW(), NOW()),
('s22', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725069968/soundy_svg/op01sa6xmhqmkrw32hiy.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068103/soundy_svg/ze4fbakddwxaubczvhxs.svg', 'Train', NOW(), NOW()),
('s23', 't4', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725070173/soundy/sctornst6cduokycq6kd.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068096/soundy_svg/cy0rbdlecgqkrqvyaagn.svg', 'City Traffic', NOW(), NOW()),
('s24', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725069983/soundy_svg/jppvoimw5lodavmthrsr.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068104/soundy_svg/jxklsmgocymtfp0a4h4t.svg', 'Waves', NOW(), NOW()),
('s25', 't5', 'https://res.cloudinary.com/dmiaubxsm/video/upload/v1725069970/soundy_svg/pdum7f7ngmke6azxbzoc.mp3', 'https://res.cloudinary.com/dmiaubxsm/image/upload/v1725068097/soundy_svg/imbzmlud8xaubmr6izwl.svg', 'Rain Forest', NOW(), NOW());

-- Dữ liệu cho bảng PeriodMembership
INSERT INTO PeriodMembership (id_membership, id_user, created_date, last_updated, start, end, price, payment_method, is_paid) VALUES
('pm1', 'u1', NOW(), NOW(), '2024-08-20 00:00:00', '2025-08-20 23:59:59', 99.99, 'credit_card', 'paid'),
('pm2', 'u2', NOW(), NOW(), '2024-08-20 00:00:00', '2025-08-20 23:59:59', 149.99, 'paypal', 'processing');

-- Dữ liệu cho bảng Template
INSERT INTO Template (id_template, id_user, id_scenario, id_music, last_updated, music_volumn) VALUES
('t1', 'u1', 's1', 'm1', NOW(), 0.7),
('t2', 'u2', 's2', 'm2', NOW(), 0.5);

-- Dữ liệu cho bảng ScenarioSoundDetail
INSERT INTO ScenarioSoundDetail (id_concatenation, id_sound, id_scenario, location_x, location_y, default_volumn) VALUES
('ssd1', 's1', 's1', 10, 10, 0.6),
('ssd2', 's2', 's1', 50, 50, 0.2),
('ssd3', 's7', 's2', 25, 25, 0.3),
('ssd4', 's8', 's2', 75, 75, 0.6);

-- Dữ liệu cho bảng SoundTemplate
INSERT INTO SoundTemplate (id_sound_template, id_sound, id_template, volumn) VALUES
('st1', 's1', 't1', 0.1),
('st2', 's2', 't2', 0.2);

-- Dữ liệu cho bảng ScenarioMusicDetail
INSERT INTO ScenarioMusicDetail (id_concatenation, id_scenario, id_music, default_volumn) VALUES
('smd1', 's1', 'm1', 0.4),
('smd2', 's2', 'm2', 0.2);


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
    SELECT id_scenario as id, name, img_path, is_free, free_time_start, free_time_end, type, is_default, is_show 
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
    SELECT id_concatenation as id, id_sound, id_scenario, location_x, location_y, default_volumn FROM ScenarioSoundDetail
    WHERE id_concatenation = p_id_concatenation;

    -- Xóa bản ghi
    DELETE FROM ScenarioSoundDetail
    WHERE id_concatenation = p_id_concatenation;
END //
-- CALL delete_scenario_sound_detail('ee6dbc5b-5c17-11ef-8672-000e1e909940');
DELIMITER ;




------------------------- Insert
-- Insert author
DELIMITER //
CREATE OR REPLACE PROCEDURE add_author(
    IN p_name VARCHAR(255),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    DECLARE v_id VARCHAR(40);

    -- Check if the author already exists
    SELECT id_author INTO v_id 
    FROM Author 
    WHERE name = p_name 
    LIMIT 1;

    IF v_id IS NOT NULL THEN
        -- If name already exists, return the existing record
        SELECT id_author AS id, name, thumbnail 
        FROM Author 
        WHERE id_author = v_id;
    ELSE
        -- If name doesn't exist, create a new record
        SET v_id = UUID();
        INSERT INTO Author (id_author, name, thumbnail)
        VALUES (v_id, p_name, p_thumbnail);

        -- Return the new record
        SELECT v_id AS id, p_name AS name, p_thumbnail AS thumbnail;
    END IF;
END //
DELIMITER ;

-- Insert Type
DELIMITER //
CREATE OR REPLACE PROCEDURE add_type(
    IN p_label VARCHAR(255),
    IN p_thumbnail VARCHAR(255)
)
BEGIN
    DECLARE v_id VARCHAR(40);

    -- Check if the label already exists
    SELECT id_type INTO v_id 
    FROM Type 
    WHERE label = p_label 
    LIMIT 1;

    IF v_id IS NOT NULL THEN
        -- If label already exists, return the existing record
        SELECT id_type AS id, label, thumbnail 
        FROM Type 
        WHERE id_type = v_id;
    ELSE
        -- If label doesn't exist, create a new record
        SET v_id = UUID();
        INSERT INTO Type (id_type, label, thumbnail)
        VALUES (v_id, p_label, p_thumbnail);

        -- Return the new record
        SELECT v_id AS id, p_label AS label, p_thumbnail AS thumbnail;
    END IF;
END //
DELIMITER ;

-- Insert User
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
    IN p_is_banned ENUM('0', '1')
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO User (id_user, first_name, last_name, middle_name, role, email, password, avatar_path, phone, gender, age, id_google, is_banned)
    VALUES (id, p_first_name, p_last_name, p_middle_name, p_role, p_email, p_password, p_avatar_path, p_phone, p_gender, p_age, p_id_google, p_is_banned);

    -- Return the ID of the newly inserted record
    SELECT id;
END //
DELIMITER ;

-- Insert Music
DELIMITER //
CREATE OR REPLACE PROCEDURE add_music(
    IN p_id_author VARCHAR(40),
    IN p_id_type VARCHAR(40),
    IN p_title VARCHAR(255),
    IN p_music_path VARCHAR(255),
    IN p_is_free ENUM('0', '1'),
    IN p_is_show ENUM('0', '1')
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Music (id_music, id_author, id_type, title, music_path, is_free, is_show)
    VALUES (id, p_id_author, p_id_type, p_title, p_music_path, p_is_free, p_is_show);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id;
END //
DELIMITER ;

-- Insert Scenario
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario(
    IN p_name VARCHAR(255),
    IN p_img_path VARCHAR(255),
    IN p_type ENUM('day', 'night', 'raining'),
    IN p_is_free ENUM('0', '1'),
    IN p_free_time_start DATETIME,
    IN p_free_time_end DATETIME,
    IN p_index INTEGER,
    IN p_is_show ENUM('0', '1')
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Scenario (id_scenario, name, img_path, is_free, free_time_start, free_time_end, type, _index, is_show)
    VALUES (id, p_name, p_img_path, p_is_free, p_free_time_start, p_free_time_end, p_type, p_index, p_is_show);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id;
END //
DELIMITER ;

-- Insert Sound
DELIMITER //
CREATE OR REPLACE PROCEDURE add_sound(
    IN p_id_type VARCHAR(40),
    IN p_sound_path VARCHAR(255),
    IN p_thumbnail VARCHAR(255),
    IN p_title VARCHAR(255),
    IN p_is_free enum("0", "1"),
    IN p_is_show enum("0", "1")
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO Sound (id_sound, id_type, sound_path, thumbnail, title, is_free, is_show)
    VALUES (id, p_id_type, p_sound_path, p_thumbnail, p_title, p_is_free, p_is_show);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id;
END //
DELIMITER ;

-- Insert PeriodMembership
DELIMITER //
CREATE OR REPLACE PROCEDURE add_period_membership(
    IN p_id_user VARCHAR(40),
    IN p_start DATETIME,
    IN p_end DATETIME,
    IN p_price DOUBLE,
    IN p_payment_method VARCHAR(10)
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO PeriodMembership (id_membership, id_user, start, `end`, price, payment_method)
    VALUES (id, p_id_user, p_start, p_end, p_price, p_payment_method);

    -- Return the ID of the newly inserted record
    SELECT id;
END //
DELIMITER ;

DELIMITER //
CREATE OR REPLACE PROCEDURE update_template(
    IN p_id_user VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40),
    IN p_music_volumn FLOAT
)
BEGIN
    DECLARE v_id VARCHAR(40);

    -- Check if a template with the given id_user already exists
    SELECT id_template INTO v_id
    FROM Template
    WHERE id_user = p_id_user
    LIMIT 1;

    IF v_id IS NOT NULL THEN
        -- If the template exists, update the existing record
        UPDATE Template
        SET id_scenario = p_id_scenario,
            id_music = p_id_music,
            music_volumn = p_music_volumn
        WHERE id_template = v_id;

        -- Return the updated record
        SELECT id_template AS id, id_user, id_scenario, id_music, music_volumn 
        FROM Template
        WHERE id_template = v_id;
    ELSE
        -- If no template exists, insert a new record
        SET v_id = UUID();
        INSERT INTO Template (id_template, id_user, id_scenario, id_music, music_volumn)
        VALUES (v_id, p_id_user, p_id_scenario, p_id_music, p_music_volumn);

        -- Return the newly inserted record
        SELECT id_template AS id, id_user, id_scenario, id_music, music_volumn 
        FROM Template
        WHERE id_template = v_id;
    END IF;
END //
DELIMITER ;

-- Insert ScenarioSoundDetail
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_sound_detail(
    IN p_id_sound VARCHAR(40),
    IN p_id_scenario VARCHAR(40),
    IN p_location_x FLOAT,
    IN p_location_y FLOAT,
    IN p_default_volumn FLOAT
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO ScenarioSoundDetail (id_concatenation, id_sound, id_scenario, location_x, location_y, default_volumn)
    VALUES (id, p_id_sound, p_id_scenario, p_location_x, p_location_y, p_default_volumn);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id;
END //
DELIMITER ;

-- Insert SoundTemplate
DELIMITER //
CREATE OR REPLACE PROCEDURE update_sound_template(
    IN p_id_sound VARCHAR(40),
    IN p_id_template VARCHAR(40),
    IN p_volumn FLOAT
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    DELETE FROM SoundTemplate WHERE id_template = p_id_template; 

    INSERT INTO SoundTemplate (id_sound_template, id_sound, id_template, volumn)
    VALUES (id, p_id_sound, p_id_template, p_volumn);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id_sound, volumn FROM SoundTemplate WHERE id_template = p_id_template;
END //
DELIMITER ;

-- Insert ScenarioMusicDetail
DELIMITER //
CREATE OR REPLACE PROCEDURE add_scenario_music_detail(
    IN p_id_scenario VARCHAR(40),
    IN p_id_music VARCHAR(40),
    IN p_default_volumn ENUM("0", "1")
)
BEGIN
    DECLARE id VARCHAR(40);
    SET id = UUID();

    INSERT INTO ScenarioMusicDetail (id_concatenation, id_scenario, id_music, default_volumn)
    VALUES (id, p_id_scenario, p_id_music, p_default_volumn);

    -- Trả về ID của bản ghi vừa thêm
    SELECT id;
END //
DELIMITER ;



-- Run procedure
-- CALL add_author('John Doe', 'path/to/thumbnail.jpg');
-- CALL add_type('Example Label', 'path/to/type.jpg');
-- CALL add_user('John', 'Doe', 'Middle', 'user', 'john.doe@example.com', 'password123', 'path/to/avatar.jpg', '1234567890', 'male', 30, 'google_id_123', '0');
-- CALL add_music("a1", "t1", "Music title", "Music path", "1", "1");
-- CALL add_scenario("Scenario name", "Scenario path", "t1", "1", null, null, 1, "1");
-- CALL add_sound("t1", "Sound path", "Sound thumbnail", "Title", "1", "1");
-- CALL add_period_membership("u1", '2024-08-20 00:00:00', '2025-08-20 23:59:59', 99.99, 'credit_card');
-- CALL add_scenario_sound_detail("s1", "s1", 0.5, 0.5, "0", 0.5);
-- CALL add_sound_template('s1', 't2', 0.7);
-- CALL add_scenario_music_detail('s1', 'm1', '1', 0.5);



-- ------------------------- Update
-- -- Update Author
-- -- Update Author Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_author_full(
--     IN p_id_author VARCHAR(40),
--     IN p_name VARCHAR(255),
--     IN p_thumbnail VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Author
--     SET name = p_name,
--         thumbnail = p_thumbnail
--     WHERE id_author = p_id_author;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_author as id, name, thumbnail FROM Author
--     WHERE id_author = p_id_author;
-- END //
-- -- CALL update_author_full('3050b5aa-5c14-11ef-8672-000e1e909940', 'New Author Name', 'new/path/to/thumbnail.jpg');
-- DELIMITER ;


-- -- Update Author Name
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_author_name(
--     IN p_id_author VARCHAR(40),
--     IN p_name VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Author
--     SET name = p_name
--     WHERE id_author = p_id_author;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_author as id, name, thumbnail FROM Author
--     WHERE id_author = p_id_author;
-- END //
-- -- CALL update_author_name('3050b5aa-5c14-11ef-8672-000e1e909940', 'Updated Author Name');
-- DELIMITER ;


-- -- Update Author Thumbnail
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_author_thumbnail(
--     IN p_id_author VARCHAR(40),
--     IN p_thumbnail VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Author
--     SET thumbnail = p_thumbnail
--     WHERE id_author = p_id_author;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_author as id, name, thumbnail FROM Author
--     WHERE id_author = p_id_author;
-- END //
-- -- CALL update_author_thumbnail('3050b5aa-5c14-11ef-8672-000e1e909940', 'new/path/to/thumbnail.jpg');
-- DELIMITER ;


-- -- Update Type
-- -- Update Type Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_type_full(
--     IN p_id_type VARCHAR(40),
--     IN p_label VARCHAR(255),
--     IN p_thumbnail VARCHAR(255),
--     IN p_is_show ENUM("0", "1")
-- )
-- BEGIN
--     UPDATE Type
--     SET label = p_label,
--         thumbnail = p_thumbnail,
--         is_show = p_is_show
--     WHERE id_type = p_id_type;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_type as id, label, thumbnail from Type
--     where id_type = p_id_type;
-- END //
-- -- CALL update_type_full('3050b5aa-5c14-11ef-8672-000e1e909940', 'New Label', 'new/path/to/thumbnail.jpg', '1');
-- DELIMITER ;


-- -- Update Type Label
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_type_label(
--     IN p_id_type VARCHAR(40),
--     IN p_label VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Type
--     SET label = p_label
--     WHERE id_type = p_id_type;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_type as id, label, thumbnail from Type
--     where id_type = p_id_type;
-- END //
-- -- CALL update_type_label('3050b5aa-5c14-11ef-8672-000e1e909940', 'New Label-test');
-- DELIMITER ;


-- -- Update Type Thumbnail
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_type_thumbnail(
--     IN p_id_type VARCHAR(40),
--     IN p_thumbnail VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Type
--     SET thumbnail = p_thumbnail
--     WHERE id_type = p_id_type;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_type as id, label, thumbnail from Type
--     where id_type = p_id_type;
-- END //
-- -- CALL update_type_thumbnail('3050b5aa-5c14-11ef-8672-000e1e909940', 'New PATH-1');
-- DELIMITER ;


-- -- Update Type is_show
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_type_is_show(
--     IN p_id_type VARCHAR(40),
--     IN p_is_show ENUM("0", "1")
-- )
-- BEGIN
--     UPDATE Type
--     SET is_show = p_is_show
--     WHERE id_type = p_id_type;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_type as id, label, thumbnail from Type
--     where id_type = p_id_type;
-- END //
-- -- CALL update_type_is_show('3050b5aa-5c14-11ef-8672-000e1e909940', '0');
-- DELIMITER ;



-- -- Update User
-- -- Update User Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_full(
--     IN p_id_user VARCHAR(40),
--     IN p_first_name VARCHAR(20),
--     IN p_last_name VARCHAR(20),
--     IN p_middle_name VARCHAR(20),
--     IN p_role ENUM('user', 'admin'),
--     IN p_email VARCHAR(255),
--     IN p_password VARCHAR(255),
--     IN p_avatar_path VARCHAR(255),
--     IN p_phone VARCHAR(12),
--     IN p_gender ENUM('male', 'female'),
--     IN p_age INT,
--     IN p_id_google VARCHAR(255),
--     IN p_is_banned ENUM('0', '1'),
--     IN p_token_reset VARCHAR(255),
--     IN p_expired_token_reset BIGINT
-- )
-- BEGIN
--     UPDATE User
--     SET first_name = p_first_name,
--         last_name = p_last_name,
--         middle_name = p_middle_name,
--         role = p_role,
--         email = p_email,
--         password = p_password,
--         avatar_path = p_avatar_path,
--         phone = p_phone,
--         gender = p_gender,
--         age = p_age,
--         id_google = p_id_google,
--         is_banned = p_is_banned,
--         token_reset = p_token_reset,
--         expired_token_reset = p_expired_token_reset
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, first_name, last_name, middle_name, role, email, avatar_path, phone, gender, age, id_google, is_banned, token_reset, expired_token_reset FROM User
--     WHERE id_user = p_id_user;
-- END //
-- -- CALL update_user_full('3050b5aa-5c14-11ef-8672-000e1e909940', 'UpdatedFirstName', 'UpdatedLastName', 'UpdatedMiddleName', 'admin', 'updated.email@example.com', 'newpassword123', 'new/path/to/avatar.jpg', '0987654321', 'female', 35, 'new_google_id_456', '1', 'new_reset_token', 2345678901);
-- DELIMITER ;


-- -- Update User Name
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_first_last_name(
--     IN p_id_user VARCHAR(40),
--     IN p_first_name VARCHAR(20),
--     IN p_last_name VARCHAR(20)
-- )
-- BEGIN
--     UPDATE User
--     SET first_name = p_first_name,
--         last_name = p_last_name
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, first_name, last_name FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User middle_name
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_middle_name(
--     IN p_id_user VARCHAR(40),
--     IN p_middle_name VARCHAR(20)
-- )
-- BEGIN
--     UPDATE User
--     SET middle_name = p_middle_name
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, middle_name FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Role
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_role(
--     IN p_id_user VARCHAR(40),
--     IN p_role ENUM('user', 'admin')
-- )
-- BEGIN
--     UPDATE User
--     SET role = p_role
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, role FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Email
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_email(
--     IN p_id_user VARCHAR(40),
--     IN p_email VARCHAR(255)
-- )
-- BEGIN
--     UPDATE User
--     SET email = p_email
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, email FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Password
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_password(
--     IN p_id_user VARCHAR(40),
--     IN p_password VARCHAR(255)
-- )
-- BEGIN
--     UPDATE User
--     SET password = p_password
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, password FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Avatar
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_avatar(
--     IN p_id_user VARCHAR(40),
--     IN p_avatar_path VARCHAR(255)
-- )
-- BEGIN
--     UPDATE User
--     SET avatar_path = p_avatar_path
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, avatar_path FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Phone
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_phone(
--     IN p_id_user VARCHAR(40),
--     IN p_phone VARCHAR(12)
-- )
-- BEGIN
--     UPDATE User
--     SET phone = p_phone
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, phone FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Gender
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_gender(
--     IN p_id_user VARCHAR(40),
--     IN p_gender ENUM('male', 'female')
-- )
-- BEGIN
--     UPDATE User
--     SET gender = p_gender
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, gender FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User Age
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_age(
--     IN p_id_user VARCHAR(40),
--     IN p_age INT
-- )
-- BEGIN
--     UPDATE User
--     SET age = p_age
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, age FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User ID Google
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_id_google(
--     IN p_id_user VARCHAR(40),
--     IN p_id_google VARCHAR(255)
-- )
-- BEGIN
--     UPDATE User
--     SET id_google = p_id_google
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, id_google FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Update User is_banned
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_is_banned(
--     IN p_id_user VARCHAR(40),
--     IN p_is_banned ENUM('0', '1')
-- )
-- BEGIN
--     UPDATE User
--     SET is_banned = p_is_banned
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_user as id, is_banned FROM User
--     WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;

-- -- Cập nhật token reset
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_user_token_reset(
--     IN p_id_user VARCHAR(40),
--     IN p_token_reset VARCHAR(255),
--     IN p_expired_token_reset BIGINT
-- )
-- BEGIN
--     UPDATE User
--     SET token_reset = p_token_reset,
--     expired_token_reset = p_expired_token_reset
--     WHERE id_user = p_id_user;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     -- SELECT id_user as id, token_reset, expired_token_reset FROM User
--     -- WHERE id_user = p_id_user;
-- END //
-- DELIMITER ;


-- -- Update Music
-- -- Update Music Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_music_full(
--     IN p_id_music VARCHAR(40),
--     IN p_id_author VARCHAR(40),
--     IN p_id_type VARCHAR(40),
--     IN p_title VARCHAR(255),
--     IN p_music_path VARCHAR(255),
--     IN p_is_show ENUM("0", "1")
-- )
-- BEGIN
--     UPDATE Music
--     SET id_author = p_id_author,
--         id_type = p_id_type,
--         title = p_title,
--         music_path = p_music_path,
--         is_show = p_is_show
--     WHERE id_music = p_id_music;

--     -- Trả về thông tin của bản ghi vừa cập nhật
--     SELECT id_music as id, id_author, id_type, title, music_path, is_show FROM Music
--     WHERE id_music = p_id_music;
-- END //
-- -- CALL update_music_full('existing-music-id', 'new-author-id', 'new-type-id', 'New Title', 'new/path/to/music.mp3', '1');
-- DELIMITER ;


-- -- Update Music Author
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_music_author(
--     IN p_id_music VARCHAR(40),
--     IN p_id_author VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Music
--     SET id_author = p_id_author
--     WHERE id_music = p_id_music;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_music as id, id_author FROM Music
--     WHERE id_music = p_id_music;
-- END //
-- DELIMITER ;


-- -- Update Music Type
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_music_type(
--     IN p_id_music VARCHAR(40),
--     IN p_id_type VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Music
--     SET id_type = p_id_type
--     WHERE id_music = p_id_music;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_music as id, id_type FROM Music
--     WHERE id_music = p_id_music;
-- END //
-- DELIMITER ;

-- -- Update Music Title
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_music_title(
--     IN p_id_music VARCHAR(40),
--     IN p_title VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Music
--     SET title = p_title
--     WHERE id_music = p_id_music;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_music as id, title FROM Music
--     WHERE id_music = p_id_music;
-- END //
-- DELIMITER ;

-- -- Update Music Path
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_music_path(
--     IN p_id_music VARCHAR(40),
--     IN p_music_path VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Music
--     SET music_path = p_music_path
--     WHERE id_music = p_id_music;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_music as id, music_path FROM Music
--     WHERE id_music = p_id_music;
-- END //
-- DELIMITER ;

-- -- Update Music is_show
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_music_is_show(
--     IN p_id_music VARCHAR(40),
--     IN p_is_show ENUM('0', '1')
-- )
-- BEGIN
--     UPDATE Music
--     SET is_show = p_is_show
--     WHERE id_music = p_id_music;

--     -- Lấy giá trị của bản ghi đã cập nhật
--     SELECT id_music as id, is_show FROM Music
--     WHERE id_music = p_id_music;
-- END //
-- DELIMITER ;



-- -- Update Scenario
-- -- Update Scenario Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_all(
--     IN p_id_scenario VARCHAR(40),
--     IN p_name VARCHAR(255),
--     IN p_img_path VARCHAR(255),
--     IN p_is_free ENUM('0', '1'),
--     IN p_free_time_start DATETIME,
--     IN p_free_time_end DATETIME,
--     IN p_type ENUM('day', 'night', 'raining'),
--     IN p_is_default ENUM('0', '1'),
--     IN p_is_show ENUM('0', '1')
-- )
-- BEGIN
--     UPDATE Scenario
--     SET name = p_name,
--         img_path = p_img_path,
--         is_free = p_is_free,
--         free_time_start = p_free_time_start,
--         free_time_end = p_free_time_end,
--         type = p_type,
--         is_default = p_is_default,
--         is_show = p_is_show
--     WHERE id_scenario = p_id_scenario;
    
--     -- Trả về giá trị đã cập nhật
--     SELECT id_scenario as id, name, img_path, is_free, free_time_start, free_time_end, type, is_default, is_show 
--     FROM Scenario
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;


-- -- Update Scenario Name
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_name(
--     IN p_id_scenario VARCHAR(40),
--     IN p_name VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Scenario
--     SET name = p_name
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;

-- -- Update Scenario img_path
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_img_path(
--     IN p_id_scenario VARCHAR(40),
--     IN p_img_path VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Scenario
--     SET img_path = p_img_path
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;

-- -- Update Scenario is_free
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_is_free(
--     IN p_id_scenario VARCHAR(40),
--     IN p_is_free ENUM('0', '1')
-- )
-- BEGIN
--     UPDATE Scenario
--     SET is_free = p_is_free
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;

-- -- Update scenario free_time 
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_free_time(
--     IN p_id_scenario VARCHAR(40),
--     IN p_free_time_start DATETIME,
--     IN p_free_time_end DATETIME
-- )
-- BEGIN
--     UPDATE Scenario
--     SET free_time_start = p_free_time_start,
--         free_time_end = p_free_time_end
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;

-- -- Update Scenario Type
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_type(
--     IN p_id_scenario VARCHAR(40),
--     IN p_type ENUM('day', 'night', 'raining')
-- )
-- BEGIN
--     UPDATE Scenario
--     SET type = p_type
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;

-- -- Update Scenario is_default
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_is_default(
--     IN p_id_scenario VARCHAR(40),
--     IN p_is_default ENUM('0', '1')
-- )
-- BEGIN
--     UPDATE Scenario
--     SET is_default = p_is_default
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;

-- -- Update Scenario is_show
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_is_show(
--     IN p_id_scenario VARCHAR(40),
--     IN p_is_show ENUM('0', '1')
-- )
-- BEGIN
--     UPDATE Scenario
--     SET is_show = p_is_show
--     WHERE id_scenario = p_id_scenario;
-- END //
-- DELIMITER ;


-- -- Update Sound
-- -- Update Sound Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_all(
--     IN p_id_sound VARCHAR(40),
--     IN p_id_type VARCHAR(40),
--     IN p_sound_path VARCHAR(255),
--     IN p_thumbnail VARCHAR(255),
--     IN p_title VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Sound
--     SET id_type = p_id_type,
--         sound_path = p_sound_path,
--         thumbnail = p_thumbnail,
--         title = p_title
--     WHERE id_sound = p_id_sound;
    
--     -- Trả về giá trị đã cập nhật
--     SELECT id_sound as id, id_type, sound_path, thumbnail, title FROM Sound
--     WHERE id_sound = p_id_sound;
-- END //
-- DELIMITER ;


-- -- Update Sound sound_path
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_path(
--     IN p_id_sound VARCHAR(40),
--     IN p_sound_path VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Sound
--     SET sound_path = p_sound_path
--     WHERE id_sound = p_id_sound;
-- END //
-- DELIMITER ;

-- -- Update SOund Thumbnail
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_thumbnail(
--     IN p_id_sound VARCHAR(40),
--     IN p_thumbnail VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Sound
--     SET thumbnail = p_thumbnail
--     WHERE id_sound = p_id_sound;
-- END //
-- DELIMITER ;

-- -- Update SOund Title
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_title(
--     IN p_id_sound VARCHAR(40),
--     IN p_title VARCHAR(255)
-- )
-- BEGIN
--     UPDATE Sound
--     SET title = p_title
--     WHERE id_sound = p_id_sound;
-- END //
-- DELIMITER ;

-- -- Update Sound id_type
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_id_type(
--     IN p_id_sound VARCHAR(40),
--     IN p_id_type VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Sound
--     SET id_type = p_id_type
--     WHERE id_sound = p_id_sound;
-- END //
-- DELIMITER ;


-- -- Update PeriodMembership status
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_period_membership_is_paid(
--     IN p_id_membership VARCHAR(40),
--     IN p_is_paid ENUM('paid', 'unpaid', 'returned', 'processing')
-- )
-- BEGIN
--     UPDATE PeriodMembership
--     SET is_paid = p_is_paid
--     WHERE id_membership = p_id_membership;
-- END //
-- DELIMITER ;


-- -- Update Template
-- -- Update Template Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_template_all(
--     IN p_id_template VARCHAR(40),
--     IN p_id_user VARCHAR(40),
--     IN p_id_scenario VARCHAR(40),
--     IN p_id_music VARCHAR(40),
--     IN p_music_volumn FLOAT
-- )
-- BEGIN
--     UPDATE Template
--     SET id_user = p_id_user,
--         id_scenario = p_id_scenario,
--         id_music = p_id_music,
--         music_volumn = p_music_volumn
--     WHERE id_template = p_id_template;
-- END //
-- DELIMITER ;


-- -- Update Template id_user
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_template_user(
--     IN p_id_template VARCHAR(40),
--     IN p_id_user VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Template
--     SET id_user = p_id_user
--     WHERE id_template = p_id_template;
-- END //
-- DELIMITER ;


-- -- Update Template id_scenario
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_template_scenario(
--     IN p_id_template VARCHAR(40),
--     IN p_id_scenario VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Template
--     SET id_scenario = p_id_scenario
--     WHERE id_template = p_id_template;
-- END //
-- DELIMITER ;


-- -- Update template id_music
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_template_music(
--     IN p_id_template VARCHAR(40),
--     IN p_id_music VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Template
--     SET id_music = p_id_music
--     WHERE id_template = p_id_template;
-- END //
-- DELIMITER ;



-- -- Update Template music_volumn
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_template_music_volumn(
--     IN p_id_template VARCHAR(40),
--     IN p_music_volumn FLOAT
-- )
-- BEGIN
--     UPDATE Template
--     SET music_volumn = p_music_volumn
--     WHERE id_template = p_id_template;
-- END //
-- DELIMITER ;

-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_template_music(
--     IN p_id_template VARCHAR(40),
--     IN p_id_music VARCHAR(40)
-- )
-- BEGIN
--     UPDATE Template
--     SET id_music = p_id_music
--     WHERE id_template = p_id_template;
-- END //
-- DELIMITER ;



-- -- Update ScenarioSoundDetail
-- -- Update ScenarioSoundDetail Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_all(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_id_sound VARCHAR(40),
--     IN p_id_scenario VARCHAR(40),
--     IN p_location_x FLOAT,
--     IN p_location_y FLOAT,
--     IN p_default_playing FLOAT,
--     IN p_default_volumn FLOAT
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET id_sound = p_id_sound,
--         id_scenario = p_id_scenario,
--         location_x = p_location_x,
--         location_y = p_location_y,
--         default_playing = p_default_playing,
--         default_volumn = p_default_volumn
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;


-- -- Update ScenarioSoundDetail id_sound
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_sound(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_id_sound VARCHAR(40)
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET id_sound = p_id_sound
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;


-- -- Update ScenarioSoundDetail id_scenario
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_scenario(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_id_scenario VARCHAR(40)
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET id_scenario = p_id_scenario
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;

-- -- Update ScenarioSoundDetail location_x
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_location_x(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_location_x FLOAT
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET location_x = p_location_x
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;

-- -- Update ScenarioSoundDetail location_y
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_location_y(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_location_y FLOAT
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET location_y = p_location_y
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;

-- -- Update ScenarioSoundDetail default_playing
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_default_playing(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_default_playing FLOAT
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET default_playing = p_default_playing
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;

-- -- Update ScenarioSoundDetail default_volumn
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_sound_detail_default_volumn(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_default_volumn FLOAT
-- )
-- BEGIN
--     UPDATE ScenarioSoundDetail
--     SET default_volumn = p_default_volumn
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;


-- -- Update SoundTemplate
-- -- Update SoundTemplate Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_template_all(
--     IN p_id_sound_template VARCHAR(40),
--     IN p_id_sound VARCHAR(40),
--     IN p_id_template VARCHAR(40),
--     IN p_volumn FLOAT
-- )
-- BEGIN
--     UPDATE SoundTemplate
--     SET id_sound = p_id_sound,
--         id_template = p_id_template,
--         volumn = p_volumn
--     WHERE id_sound_template = p_id_sound_template;
    
--     -- Trả về giá trị đã cập nhật
--     SELECT id_sound_template as id, id_sound, id_template, volumn FROM SoundTemplate
--     WHERE id_sound_template = p_id_sound_template;
-- END //
-- DELIMITER ;
-- -- Update SoundTemplate id_sound
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_template_sound(
--     IN p_id_sound_template VARCHAR(40),
--     IN p_id_sound VARCHAR(40)
-- )
-- BEGIN
--     UPDATE SoundTemplate
--     SET id_sound = p_id_sound
--     WHERE id_sound_template = p_id_sound_template;
-- END //
-- DELIMITER ;


-- -- Update SoundTemplate id_template
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_template_template(
--     IN p_id_sound_template VARCHAR(40),
--     IN p_id_template VARCHAR(40)
-- )
-- BEGIN
--     UPDATE SoundTemplate
--     SET id_template = p_id_template
--     WHERE id_sound_template = p_id_sound_template;
-- END //
-- DELIMITER ;


-- -- Update SoundTemplate Volumn
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_sound_template_volumn(
--     IN p_id_sound_template VARCHAR(40),
--     IN p_volumn FLOAT
-- )
-- BEGIN
--     UPDATE SoundTemplate
--     SET volumn = p_volumn
--     WHERE id_sound_template = p_id_sound_template;
-- END //
-- DELIMITER ;


-- -- Update ScenarioMusicDetail
-- -- Update ScenarioMusicDetail Full
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_music_detail_full(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_id_scenario VARCHAR(40),
--     IN p_id_music VARCHAR(40),
--     IN p_is_default ENUM("0", "1")
-- )
-- BEGIN
--     UPDATE ScenarioMusicDetail
--     SET id_scenario = p_id_scenario,
--         id_music = p_id_music,
--         is_default = p_is_default
--     WHERE id_concatenation = p_id_concatenation;

--     -- Trả về thông tin của bản ghi vừa cập nhật
--     SELECT id_concatenation as id, id_scenario, id_music, is_default FROM ScenarioMusicDetail
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;


-- -- Update ScenarioMusicDetail scenario_id 
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_music_detail_scenario(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_id_scenario VARCHAR(40)
-- )
-- BEGIN
--     UPDATE ScenarioMusicDetail
--     SET id_scenario = p_id_scenario
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;


-- -- Update ScenarioMusicDetail id_music
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_music_detail_music(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_id_music VARCHAR(40)
-- )
-- BEGIN
--     UPDATE ScenarioMusicDetail
--     SET id_music = p_id_music
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;


-- -- Update ScenarioMusicDetail is_default
-- DELIMITER //
-- CREATE OR REPLACE PROCEDURE update_scenario_music_detail_is_default(
--     IN p_id_concatenation VARCHAR(40),
--     IN p_is_default ENUM("0", "1")
-- )
-- BEGIN
--     UPDATE ScenarioMusicDetail
--     SET is_default = p_is_default
--     WHERE id_concatenation = p_id_concatenation;
-- END //
-- DELIMITER ;