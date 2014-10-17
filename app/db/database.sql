DROP TABLE IF EXISTS User CASCADE;
DROP TABLE IF EXISTS Category CASCADE;
DROP TABLE IF EXISTS Challenge CASCADE;
DROP TABLE IF EXISTS ChallengeCategory CASCADE;
DROP TABLE IF EXISTS Comment CASCADE;
DROP TABLE IF EXISTS RateChallenge CASCADE;
DROP TABLE IF EXISTS RateComment CASCADE;
DROP TABLE IF EXISTS ChallengeProof CASCADE;

CREATE TYPE UserType AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE UserState AS ENUM ('ban', 'tempban', 'normal');
CREATE TYPE ChallengePrivacy AS ENUM ('private', 'community', 'friendly');
/*CREATE TYPE ChallengeCategory AS ENUM ('Serious','Funny','Dangerous','NSFW','Intervening','Sentimental','Ugh','Idiotic');*/
CREATE TYPE ChallengeType AS ENUM ('Text', 'Audio', 'Video', 'Picture');

CREATE TABLE IF NOT EXISTS User (
  username       VARCHAR(15) PRIMARY KEY NOT NULL,
  pass           VARCHAR                 NOT NULL,
  name           VARCHAR                 NOT NULL,
  email          VARCHAR UNIQUE          NOT NULL,
  photo          VARCHAR,
  work           VARCHAR,
  hometown       VARCHAR,
  lastFreePoints DATE                    NOT NULL DEFAULT NOW,
  xp             INTEGER                 NOT NULL DEFAULT 0,
  user_type      UserType,
  user_state     UserState,
  CHECK (char_length(pass) > 6), /*VERIFY ON CLIENT SIDE*/
  CHECK (char_length(username) > 4)
);

CREATE TABLE IF NOT EXISTS Category (
  name VARCHAR PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS ChallengeCategory (
  challengeID  INTEGER,
  categoryName VARCHAR,
  FOREIGN KEY (challengeID) REFERENCES Challenge (challengeID),
  FOREIGN KEY (categoryName) REFERENCES Category (name)
);

CREATE TABLE IF NOT EXISTS Challenge (
  challengeID SERIAL PRIMARY KEY,
  content     VARCHAR NOT NULL,
  difficulty  INTEGER NOT NULL,
  privacy     challengePrivacy DEFAULT 'community',
  type        challengeType,
  username    VARCHAR(15) REFERENCES User ON DELETE CASCADE,
  CHECK (difficulty >= 1 AND difficulty <= 5)
);

CREATE TABLE IF NOT EXISTS Comment (
  commentID   SERIAL PRIMARY KEY NOT NULL,
  content     VARCHAR(150)       NOT NULL,
  username    VARCHAR(15) REFERENCES User ON DELETE SET NULL,
  challengeID INTEGER REFERENCES Challenge ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RateChallenge (
  username    VARCHAR(15),
  challengeID INTEGER,
  rating      INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES User (username) ON DELETE SET NULL,
  FOREIGN KEY (challengeID) REFERENCES Challenge (challengeID),
  CHECK (rating = -1 OR rating = 1)
);

CREATE TABLE IF NOT EXISTS RateComment (
  username  VARCHAR(15),
  commentID INTEGER,
  rating    INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES User (username) ON DELETE SET NULL,
  FOREIGN KEY (commentID) REFERENCES Comment (commentID) ON DELETE CASCADE,
  CHECK (rating = -1 OR rating = 1)
);

CREATE TABLE IF NOT EXISTS RateProof (
  username VARCHAR(15),
  proofID  INTEGER,
  rating   INTEGER NOT NULL,
  FOREIGN KEY (username) REFERENCES User (username) ON DELETE SET NULL,
  FOREIGN KEY (proofID) REFERENCES ChallengeProof (proofID),
  CHECK (rating = -1 OR rating = 1)
);

CREATE TABLE IF NOT EXISTS ChallengeProof (
  proofID     SERIAL PRIMARY KEY NOT NULL,
  username    VARCHAR(15) REFERENCES User ON DELETE CASCADE,
  challengeID INTEGER REFERENCES Challenge ON DELETE CASCADE,
  content     VARCHAR, /*Null until user has uploaded proof due to friendly challenges*/
  CONSTRAINT un UNIQUE (username, challengeID)
);

CREATE TABLE IF NOT EXISTS Achievements (
  name         VARCHAR NOT NULL,
  pointsReward INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS UserAchievement (
  username         VARCHAR(15),
  achievementsName VARCHAR,
  FOREIGN KEY (username) REFERENCES User (username) ON DELETE CASCADE,
  FOREIGN KEY (achievementsName) REFERENCES Achievements (name)
);