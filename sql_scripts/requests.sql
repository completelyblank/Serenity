CREATE TABLE requests (
    user_id NUMBER(10) REFERENCES users(user_id),
    chat_room_id NUMBER(10) REFERENCES chat_rooms(chat_room_id),
    PRIMARY KEY (user_id, chat_room_id)
);

