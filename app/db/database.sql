/***********************************
*              Cleanup             *
************************************/
DROP TABLE IF EXISTS UserAchievement;
DROP TABLE IF EXISTS Achievement;
DROP TABLE IF EXISTS RateChallengeProof;
DROP TABLE IF EXISTS ChallengeProof;
DROP TABLE IF EXISTS RateComment;
DROP TABLE IF EXISTS RateChallenge;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS ChallengeCategory;
DROP TABLE IF EXISTS Challenge;
DROP TABLE IF EXISTS Category;
DROP TABLE IF EXISTS RegisteredUser;

DROP TYPE IF EXISTS UserType;
DROP TYPE IF EXISTS UserState;
DROP TYPE IF EXISTS ChallengePrivacy;
DROP TYPE IF EXISTS ChallengeType;


/***********************************
*              Types               *
************************************/
CREATE TYPE UserType        AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE UserState       AS ENUM ('ban', 'tempban', 'normal');
CREATE TYPE ChallengeTarget AS ENUM ('private', 'community', 'friendly');
CREATE TYPE ChallengeType   AS ENUM ('Text', 'Audio', 'Video', 'Picture');


/***********************************
*              Tables              *
************************************/
CREATE TABLE RegisteredUser (
  userID         SERIAL      PRIMARY KEY,
  username       VARCHAR(15)             NOT NULL,
  pass           VARCHAR                 NOT NULL,
  name           VARCHAR                 NOT NULL,
  email          VARCHAR     UNIQUE      NOT NULL,
  photo          VARCHAR,
  work           VARCHAR,
  hometown       VARCHAR,
  lastFreePoints TIMESTAMP               NOT NULL DEFAULT CURRENT_TIMESTAMP,
  xp             INTEGER                 NOT NULL DEFAULT 0,
  userType       UserType,
  userState      UserState,

  CHECK (char_length(pass) > 6),
  CHECK (char_length(Username) > 4)
);


CREATE TABLE  Category (
  categoryID SERIAL PRIMARY KEY,
  name       VARCHAR
);


CREATE TABLE  Challenge (
  challengeID  SERIAL           PRIMARY KEY,
  userID       INTEGER, 
  content      VARCHAR          NOT NULL,
  difficulty   INTEGER          NOT NULL,
  target       ChallengeTarget  DEFAULT 'community',
  type         challengeType,
  targetUserID INTEGER,

  FOREIGN KEY (userID) REFERENCES RegisteredUser               ON DELETE CASCADE,
  FOREIGN KEY (targetUserID) REFERENCES RegisteredUser(userID) ON DELETE CASCADE,
  CHECK (difficulty >= 1 AND difficulty <= 5)
);


CREATE TABLE  ChallengeCategory (
  challengeID  INTEGER,
  categoryID   INTEGER,

  PRIMARY KEY (challengeID, categoryID),
  FOREIGN KEY (challengeID)  REFERENCES Challenge,
  FOREIGN KEY (categoryID) REFERENCES Category
);


CREATE TABLE  Comment (
  commentID   SERIAL       PRIMARY KEY NOT NULL,
  content     VARCHAR(150)             NOT NULL,
  userID      INTEGER,
  challengeID INTEGER,

  FOREIGN KEY (userID)      REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (challengeID) REFERENCES Challenge ON DELETE CASCADE
);


CREATE TABLE  RateChallenge (
  userID      INTEGER,
  challengeID INTEGER,
  rating      INTEGER NOT NULL,

  FOREIGN KEY (userID)      REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (challengeID) REFERENCES Challenge,
  CHECK (rating = -1 OR rating = 1)
);


CREATE TABLE  RateComment (
  userID    INTEGER,
  commentID INTEGER,
  rating    INTEGER NOT NULL,

  FOREIGN KEY (userID)    REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (commentID) REFERENCES Comment ON DELETE CASCADE,
  CHECK (rating = -1 OR rating = 1)
);


CREATE TABLE  ChallengeProof (
  proofID     SERIAL PRIMARY KEY NOT NULL,
  userID      INTEGER,
  challengeID INTEGER,
  content     VARCHAR            NOT NULL,

  FOREIGN KEY(userID)      REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY(challengeID) REFERENCES Challenge ON DELETE CASCADE,
  CONSTRAINT un UNIQUE (userID, challengeID)
);


CREATE TABLE  RateChallengeProof (
  userID   INTEGER,
  proofID  INTEGER,
  rating   INTEGER NOT NULL,

  FOREIGN KEY (userID)  REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (proofID) REFERENCES ChallengeProof,
  CHECK (rating = -1 OR rating = 1)
);


CREATE TABLE  Achievement (
  achievementID SERIAL PRIMARY KEY,
  name          VARCHAR UNIQUE NOT NULL,
  pointsReward  INTEGER NOT NULL
);


CREATE TABLE  UserAchievement (
  userID         INTEGER,
  achievementID  INTEGER,
  FOREIGN KEY (userID)         REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY (achievementID) REFERENCES Achievement
);

/***********************************
*            Inserts               *
************************************/


/* Categories */

INSERT INTO Category(name) VALUES 
  ('Serious'),
  ('Funny'),
  ('Dangerous'),
  ('NSFW'),
  ('Intervening'),
  ('Sentimental'),
  ('Ugh'),
  ('Idiotic');

/* Users */

INSERT INTO User VALUES
  ("mod1", "passmod1", "Mod", "mod@gmail.com", "/path/to/photo.jpg", "job", "hometown", DEFAULT, DEFAULT, "moderator",
   "normal");

INSERT INTO User VALUES
  ("joao", "passjoao", "Joao", "joao@gmail.com", "/path/to/photo.jpg", "job", "hometown", DEFAULT, DEFAULT, "user",
   "normal");
INSERT INTO User VALUES
  ("manuel", "passmanuel", "Manuel", "manuel@gmail.com", "/path/to/photo.jpg", "job", "hometown", DEFAULT, DEFAULT,
   "user", "normal");


-- TODO: make a check for challengeproof && friendly challenge (content == NULL and so on)*/

/*
CREATE OR REPLACE FUNCTION assert_new_challenge_target() RETURNS TRIGGER AS 
$$
BEGIN
IF NEW.targetUserID == NULL THEN 
	IF NEW.target == 'private' THEN
		RAISE EXCEPTION 'private challenge did not specifies the target user';
	ELSE 
		RETURN NEW;
END IF;
IF NEW.targetUserID != NULL AND (NEW.target == 'community' OR NEW.target == 'friendly') THEN
	RAISE EXCEPTION 'public challenge has a target user specified';
ELSE
	RETURN NEW;
END IF;
END
$$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assert_new_challenge_target_trigger ON Challenge;
CREATE TRIGGER assert_new_challenge_target_trigger
BEFORE INSERT ON ProductCategory
FOR EACH ROW EXECUTE PROCEDURE assert_new_challenge_target();
*/