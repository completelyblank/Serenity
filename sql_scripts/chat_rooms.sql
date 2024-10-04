CREATE TABLE chat_rooms (
    chat_room_id NUMBER(10) PRIMARY KEY,
    chat_room_name VARCHAR2(100),
    admin_id NUMBER(10) REFERENCES users(user_id)
);

CREATE SEQUENCE chat_sequence 
  START WITH 1 
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;
  
CREATE OR REPLACE TRIGGER chat_before_insert
BEFORE INSERT ON chat_rooms
FOR EACH ROW
BEGIN
  IF :new.chat_room_id IS NULL THEN
    SELECT chat_sequence.NEXTVAL INTO :new.chat_room_id FROM dual;
  END IF;
END;
/

INSERT INTO chat_rooms(chat_room_name, admin_id) VALUES('The Listening Lounge', 1);
INSERT INTO chat_rooms(chat_room_name, admin_id) VALUES('Sunny Side Up', 2);
INSERT INTO chat_rooms(chat_room_name, admin_id) VALUES('Achievement Arena', 3);
INSERT INTO chat_rooms(chat_room_name, admin_id) VALUES('Compassion Corner', 1);

SELECT * FROM chat_rooms;
