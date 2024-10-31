CREATE TABLE emojis (
  emoji_id NUMBER PRIMARY KEY, 
  emoji VARCHAR(15) NOT NULL UNIQUE
);

SELECT * FROM emojis;

CREATE SEQUENCE emoji_sequence 
  START WITH 1 
  INCREMENT BY 1;

CREATE OR REPLACE TRIGGER emojis_on_insert
  BEFORE INSERT ON emojis
  FOR EACH ROW
BEGIN
  SELECT emoji_sequence.NEXTVAL
  INTO :new.emoji_id
  FROM dual;
END;
/

INSERT INTO emojis(emoji) VALUES ('Happy');
INSERT INTO emojis(emoji) VALUES ('Neutral');
INSERT INTO emojis(emoji) VALUES ('Angry');
INSERT INTO emojis(emoji) VALUES ('Sad');
INSERT INTO emojis(emoji) VALUES ('Blessed');
INSERT INTO emojis(emoji) VALUES ('Content');