SET DATESTYLE TO PostgreSQL, European;
SET TIMEZONE TO 'Portugal';

DROP FUNCTION IF EXISTS merge_ratechallenge(integer,integer,integer);

DROP TABLE IF EXISTS Friendship;
DROP TABLE IF EXISTS PersistentNotifications;
DROP TABLE IF EXISTS UserAchievement;
DROP TABLE IF EXISTS Achievement;
DROP TABLE IF EXISTS RateChallengeProof;
DROP TABLE IF EXISTS RateComment;
DROP TABLE IF EXISTS RateChallenge;
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS ChallengeCategory;
DROP TABLE IF EXISTS ChallengeProof;
DROP TABLE IF EXISTS Challenge;
DROP TABLE IF EXISTS RegisteredUser;
DROP TABLE IF EXISTS Category;

DROP TYPE IF EXISTS StatusType;
DROP TYPE IF EXISTS UserType;
DROP TYPE IF EXISTS UserState;
DROP TYPE IF EXISTS ChallengeTarget;
DROP TYPE IF EXISTS ChallengeType;


/***********************************
*              Types               *
************************************/
CREATE TYPE UserType AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE UserState AS ENUM ('ban', 'tempban', 'normal');
CREATE TYPE ChallengeTarget AS ENUM ('private', 'community', 'friendly');
CREATE TYPE ChallengeType AS ENUM ('text', 'audio', 'video', 'photo');
CREATE TYPE StatusType AS ENUM ('read', 'unread', 'accepted');


/***********************************
*              Tables              *
************************************/
CREATE TABLE RegisteredUser (
  userID         SERIAL PRIMARY KEY,
  username       VARCHAR(15) UNIQUE            NOT NULL,
  pass           VARCHAR                       NOT NULL,
  name           VARCHAR                       NOT NULL,
  email          VARCHAR UNIQUE                NOT NULL,
  work           VARCHAR,
  hometown       VARCHAR,
  lastFreePoints TIMESTAMP                     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  xp             INTEGER                       NOT NULL DEFAULT 0,
  userType       UserType,
  userState      UserState,
  passwordToken  VARCHAR(255)                           DEFAULT 'null',

  CHECK (char_length(pass) > 6),
  CHECK (char_length(Username) > 4)
);


CREATE TABLE Category (
  categoryID SERIAL PRIMARY KEY,
  name       VARCHAR
);

CREATE TABLE Challenge (
  challengeID  SERIAL PRIMARY KEY,
  name         VARCHAR                             NOT NULL,
  userID       INTEGER                             NOT NULL,
  content      VARCHAR                             NOT NULL,
  difficulty   INTEGER                             NOT NULL,
  target       ChallengeTarget DEFAULT 'community' NOT NULL,
  type         ChallengeType                       NOT NULL,
  targetUserID INTEGER,

  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY (targetUserID) REFERENCES RegisteredUser (userID) ON DELETE CASCADE,
  CHECK (difficulty >= 1 AND difficulty <= 5)
);


CREATE TABLE ChallengeCategory (
  challengeID INTEGER,
  categoryID  INTEGER,

  PRIMARY KEY (challengeID, categoryID),
  FOREIGN KEY (challengeID) REFERENCES Challenge,
  FOREIGN KEY (categoryID) REFERENCES Category
);


CREATE TABLE Comment (
  commentID   SERIAL PRIMARY KEY NOT NULL,
  userID      INTEGER,
  challengeID INTEGER,
  content     VARCHAR(150)       NOT NULL,

  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (challengeID) REFERENCES Challenge ON DELETE CASCADE
);


CREATE TABLE RateChallenge (
  userID      INTEGER,
  challengeID INTEGER,
  rating      INTEGER NOT NULL,

  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (challengeID) REFERENCES Challenge,
  CHECK (rating >= 0 AND rating <= 5)
);


CREATE TABLE RateComment (
  userID    INTEGER,
  commentID INTEGER,
  rating    INTEGER NOT NULL,

  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (commentID) REFERENCES Comment ON DELETE CASCADE,
  CHECK (rating = -1 OR rating = 1)
);


CREATE TABLE ChallengeProof (
  proofID     SERIAL PRIMARY KEY,
  userID      INTEGER,
  challengeID INTEGER,
  content     VARCHAR NOT NULL,

  UNIQUE (userID, challengeID),
  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY (challengeID) REFERENCES Challenge ON DELETE CASCADE
);

CREATE TABLE RateChallengeProof (
  userID  INTEGER,
  proofID INTEGER,
  rating  INTEGER NOT NULL,

  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE SET NULL,
  FOREIGN KEY (proofID) REFERENCES ChallengeProof,
  CHECK (rating >= 0 AND rating <= 5)
);

CREATE TABLE Achievement (
  achievementID SERIAL PRIMARY KEY,
  name          VARCHAR UNIQUE NOT NULL,
  pointsReward  INTEGER        NOT NULL
);


CREATE TABLE UserAchievement (
  userID        INTEGER,
  achievementID INTEGER,
  FOREIGN KEY (userID) REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY (achievementID) REFERENCES Achievement
);

CREATE TABLE PersistentNotifications (
  notificationID SERIAL PRIMARY KEY,
  receiverID     INTEGER,
  senderID       INTEGER,
  type           VARCHAR,
  info           INTEGER,
  status         StatusType,
  FOREIGN KEY (receiverID) REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY (senderID) REFERENCES RegisteredUser ON DELETE CASCADE

);

CREATE TABLE IF NOT EXISTS Friendship (
  friend1 INTEGER,
  friend2 INTEGER REFERENCES RegisteredUser ON DELETE CASCADE,
  FOREIGN KEY (friend1) REFERENCES RegisteredUser ON DELETE CASCADE,
  CONSTRAINT fr UNIQUE (friend1, friend2),
  CHECK (friend1 < friend2)
);

/***********************************
*            Inserts               *
************************************/


/* Categories */

INSERT INTO Category (name) VALUES
  ('Serious'),
  ('Funny'),
  ('Dangerous'),
  ('NSFW'),
  ('Intervening'),
  ('Sentimental'),
  ('Ugh'),
  ('Idiotic');

/* Users */

INSERT INTO RegisteredUser VALUES
  (DEFAULT, 'modd1', '$2a$10$HYNUS6BrRvShEIeiDuvaDOwSBKQDGq0ikEX.CVaRmZHAo135MsB.u', 'Mod', 'mod@gmail.com', 'job',
   'hometown', DEFAULT, DEFAULT, 'moderator', 'normal');
-- passmod1

INSERT INTO RegisteredUser VALUES
  (DEFAULT, 'joao1', '$2a$10$lUN28f9Qfrsa3En2ldAnh./EjUrOgYX6F0kkTGf7PzI407vvZmiTy', 'Joao', 'joao@gmail.com', 'job',
   'hometown', DEFAULT, DEFAULT, 'user', 'normal');
-- passjoao
INSERT INTO RegisteredUser VALUES
  (DEFAULT, 'manuel', '$2a$10$CG9qQ.rImbgqHTDAu.sexeXYYB6fxs7po5fNxZALmrYPCQenBtH42', 'Manuel', 'manuel@gmail.com',
   'job', 'hometown', DEFAULT, DEFAULT, 'user', 'normal');
-- passmanuel


-- TODO: make a check for challengeproof && friendly challenge (content == NULL and so on)*/


CREATE OR REPLACE FUNCTION assert_new_challenge_target()
  RETURNS TRIGGER AS
  $$
  BEGIN
    IF NEW.targetUserID = NULL
    THEN
      IF NEW.target = 'private'
      THEN
        RAISE EXCEPTION 'private challenge did not specifies the target user';
      ELSE
        RETURN NEW;
      END IF;
      IF NEW.targetUserID != NULL AND (NEW.target = 'community' OR NEW.target = 'friendly')
      THEN
        RAISE EXCEPTION 'public challenge has a target user specified';
      ELSE
        RETURN NEW;
      END IF;
    ELSE
      RETURN NEW;
    END IF;
  END;
  $$
LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS assert_new_challenge_target_trigger ON Challenge;
CREATE TRIGGER assert_new_challenge_target_trigger
BEFORE INSERT ON Challenge
FOR EACH ROW EXECUTE PROCEDURE assert_new_challenge_target();


CREATE OR REPLACE FUNCTION merge_rateChallenge(u_challengeID INT, u_userID INT, u_rating INT)
  RETURNS VOID AS
  $$
  BEGIN
    LOOP
-- first try to update the key
      UPDATE RateChallenge
      SET rating = u_rating
      WHERE challengeID = u_challengeID
            AND userID = u_userID;
      IF found
      THEN
        RETURN;
      END IF;
-- not there, so try to insert the key
-- if someone else inserts the same key concurrently,
-- we could get a unique-key failure
      BEGIN
        INSERT INTO RateChallenge (challengeID, userID, rating) VALUES (u_challengeID, u_userID, u_rating);
        RETURN;
        EXCEPTION WHEN unique_violation
        THEN
-- do nothing, and loop to try the UPDATE again
      END;
    END LOOP;
  END;
  $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION merge_rateChallengeProof(u_proofID INT, u_userID INT, u_rating INT)
  RETURNS VOID AS
  $$
  BEGIN
    LOOP
-- first try to update the key
      UPDATE RateChallengeProof
      SET rating = u_rating
      WHERE proofID = u_proofID
            AND userID = u_userID;
      IF found
      THEN
        RETURN;
      END IF;
-- not there, so try to insert the key
-- if someone else inserts the same key concurrently,
-- we could get a unique-key failure
      BEGIN
        INSERT INTO RateChallengeProof (proofID, userID, rating) VALUES (u_proofID, u_userID, u_rating);
        RETURN;
        EXCEPTION WHEN unique_violation
        THEN
-- do nothing, and loop to try the UPDATE again
      END;
    END LOOP;
  END;
  $$
LANGUAGE plpgsql;

INSERT INTO Challenge VALUES
  (DEFAULT, 'most awkward onomatopoeic', 1, 'be imaginative', 1, DEFAULT, 'text', NULL);

INSERT INTO ChallengeCategory VALUES
  (1, 8);

INSERT INTO RateChallenge VALUES
  (1, 1, 1),
  (2, 1, 1);

INSERT INTO Comment VALUES
  (DEFAULT, 1, 1, 'oeih');

INSERT INTO ChallengeProof VALUES
  (DEFAULT, 1, 1, 'OFHWEOIHFO');
