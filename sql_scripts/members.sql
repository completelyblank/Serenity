CREATE TABLE members (
    user_id NUMBER(10, 0) REFERENCES users(user_id) ON DELETE CASCADE, 
    chat_room_id NUMBER(10, 0) REFERENCES chat_rooms(chat_room_id) ON DELETE CASCADE, 
    is_active NUMBER DEFAULT 0,
    PRIMARY KEY (user_id, chat_room_id)
);

INSERT INTO members(user_id, chat_room_id) VALUES(1, 1);
INSERT INTO members(user_id, chat_room_id) VALUES(1, 4);
INSERT INTO members(user_id, chat_room_id) VALUES(3, 3);
INSERT INTO members(user_id, chat_room_id) VALUES(2, 2);
INSERT INTO members(user_id, chat_room_id) VALUES(4, 3);
INSERT INTO members(user_id, chat_room_id) VALUES(5, 2);
INSERT INTO members(user_id, chat_room_id) VALUES(6, 1);
INSERT INTO members(user_id, chat_room_id) VALUES(7, 4);
INSERT INTO members(user_id, chat_room_id) VALUES(4, 2);
INSERT INTO members(user_id, chat_room_id) VALUES(5, 3);
INSERT INTO members(user_id, chat_room_id) VALUES(7, 2);
INSERT INTO members(user_id, chat_room_id) VALUES(7, 3);
INSERT INTO members(user_id, chat_room_id) VALUES(3, 1);

SELECT * FROM members;