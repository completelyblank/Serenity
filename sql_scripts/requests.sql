CREATE TABLE requests (
    user_id NUMBER(10) REFERENCES users(user_id),
    chat_room_id NUMBER(10) REFERENCES chat_rooms(chat_room_id),
    PRIMARY KEY (user_id, chat_room_id)
);

SELECT * FROM requests;

INSERT INTO requests VALUES(2,2);
INSERT INTO requests VALUES(3,2);
INSERT INTO requests VALUES(4,2);
INSERT INTO requests VALUES(5,2);
INSERT INTO requests VALUES(6,2);
INSERT INTO requests VALUES(7,2);