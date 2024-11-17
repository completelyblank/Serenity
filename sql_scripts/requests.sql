CREATE TABLE requests (
    user_id NUMBER REFERENCES users(user_id),
    chat_room_id NUMBER(10) REFERENCES chat_rooms(chat_room_id),
    request_date DATE DEFAULT SYSDATE,
    PRIMARY KEY (user_id, chat_room_id)
);

INSERT INTO requests(user_id, chat_room_id) VALUES(2,2);
INSERT INTO requests(user_id, chat_room_id) VALUES(3,2);
INSERT INTO requests(user_id, chat_room_id) VALUES(4,2);
INSERT INTO requests(user_id, chat_room_id) VALUES(5,2);
INSERT INTO requests(user_id, chat_room_id) VALUES(6,2);
INSERT INTO requests(user_id, chat_room_id) VALUES(7,2);

SELECT U.user_id, U.username, U.first_name, U.last_name, U.gender, 
          TO_CHAR(r.request_date, 'DD Mon YYYY') AS sent_date, 
          TO_CHAR(r.request_date, 'HH:MI AM') AS sent_time
          FROM users U 
          JOIN requests R
          ON U.user_id = R.user_id
          WHERE R.chat_room_id = 2;