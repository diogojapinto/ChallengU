DROP TABLE IF EXISTS User CASCADE;
DROP TABLE IF EXISTS Category CASCADE;
DROP TABLE IF EXISTS Challenge CASCADE;  
DROP TABLE IF EXISTS ChallengeCategory CASCADE;
DROP TABLE IF EXISTS Comment CASCADE;
DROP TABLE IF EXISTS RateChallenge CASCADE;
DROP TABLE IF EXISTS RateComment CASCADE;
DROP TABLE IF EXISTS ChallengeProof CASCADE;

CREATE TYPE userType AS ENUM ('user','moderator','admin');
CREATE TYPE userState AS ENUM ('ban', 'tempban', 'normal');
CREATE TYPE challengePrivacy AS ENUM ('private', 'community', 'friendly');
CREATE TYPE challengeCategory AS ENUM ('Serious','Funny','Dangerous','NSFW','Intervening','Sentimental','Ugh','Idiotic');
CREATE TYPE challengeType AS ENUM ('Text','Audio','Video','Picture');

CREATE TABLE IF NOT EXISTS User (
	username VARCHAR(15) PRIMARY KEY NOT NULL, 
	name VARCHAR NOT NULL,
	email VARCHAR UNIQUE NOT NULL,
	photo VARCHAR NOT NULL,
	work VARCHAR NOT NULL,
	hometown VARCHAR NOT NULL,
	user_type userType,
	user_state userState,
	CHECK (char_length(pass) > 8),
	CHECK (char_length(username) > 6)
);

CREATE TABLE IF NOT EXISTS Category (
	type challengeCategory PRIMARY KEY NOT NULL
);

CREATE TABLE IF NOT EXISTS Challenge (
	challengeID SERIAL PRIMARY KEY,
	content VARCHAR NOT NULL,
	difficulty INTEGER,
	privacy challengePrivacy,
	type challengeType, 
	username VARCHAR(15) REFERENCES User ON DELETE CASCADE,
	CHECK (difficulty >=1 AND difficulty <= 5)
);

CREATE TABLE IF NOT EXISTS ChallengeCategory(
	challengeID INTEGER REFERENCES Challenge ON DELETE CASCADE,
	cat challengeCategory REFERENCES Category ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Comment (
	commentID SERIAL PRIMARY KEY NOT NULL,
	content VARCHAR(150) NOT NULL,
	username VARCHAR(15) REFERENCES User ON DELETE SET NULL,
	challengeID INTEGER REFERENCES Challenge ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RateChallenge(
	username VARCHAR(15) REFERENCES User ON DELETE SET NULL,
	challengeID INTEGER REFERENCES Challenge ON DELETE CASCADE,
	rating INTEGER NOT NULL,
	CHECK (rating = -1 OR rating = 1)
);

CREATE TABLE IF NOT EXISTS RateComment(
	username VARCHAR(15) REFERENCES User ON DELETE SET NULL,
	commentID INTEGER REFERENCES Comment ON DELETE CASCADE,
	rating INTEGER NOT NULL,
	CHECK (rating = -1 OR rating = 1)
);

CREATE TABLE IF NOT EXISTS ChallengeProof (
	proofID SERIAL PRIMARY KEY NOT NULL,
	username VARCHAR(15) REFERENCES User ON DELETE CASCADE,
	challengeID INTEGER REFERENCES Challenge ON DELETE CASCADE,
	content VARCHAR NOT NULL,
	CONSTRAINT un UNIQUE(username,challengeID)
);