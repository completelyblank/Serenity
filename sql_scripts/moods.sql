CREATE TABLE moods (
  mood_id NUMBER PRIMARY KEY, 
  mood VARCHAR(15) NOT NULL UNIQUE
);

CREATE SEQUENCE mood_sequence 
  START WITH 1 
  INCREMENT BY 1;

CREATE OR REPLACE TRIGGER moods_on_insert
  BEFORE INSERT ON moods
  FOR EACH ROW
BEGIN
  SELECT mood_sequence.NEXTVAL
  INTO :new.mood_id
  FROM dual;
END;