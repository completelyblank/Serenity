CREATE TABLE tags (
  tag_id NUMBER PRIMARY KEY, 
  tag_name VARCHAR(15) NOT NULL UNIQUE
);

CREATE SEQUENCE tag_sequence 
  START WITH 1 
  INCREMENT BY 1;

CREATE OR REPLACE TRIGGER tags_on_insert
  BEFORE INSERT ON tags
  FOR EACH ROW
BEGIN
  SELECT tag_sequence.NEXTVAL
  INTO :new.tag_id
  FROM dual;
END;
/

INSERT INTO tags (tag_name) VALUES ('Happy');
INSERT INTO tags (tag_name) VALUES ('Sad');
INSERT INTO tags (tag_name) VALUES ('Excited');
INSERT INTO tags (tag_name) VALUES ('Calm');
INSERT INTO tags (tag_name) VALUES ('Angry');
INSERT INTO tags (tag_name) VALUES ('Hopeful');
INSERT INTO tags (tag_name) VALUES ('Inspired');
INSERT INTO tags (tag_name) VALUES ('Anxious');
INSERT INTO tags (tag_name) VALUES ('Joyful');
INSERT INTO tags (tag_name) VALUES ('Peaceful');
INSERT INTO tags (tag_name) VALUES ('Motivated');
INSERT INTO tags (tag_name) VALUES ('Bored');
INSERT INTO tags (tag_name) VALUES ('Relaxed');
INSERT INTO tags (tag_name) VALUES ('Confused');
INSERT INTO tags (tag_name) VALUES ('Energized');