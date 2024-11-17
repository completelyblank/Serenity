CREATE TABLE messages (
    message_id NUMBER PRIMARY KEY,
    chat_room_id NUMBER(10) REFERENCES chat_rooms(chat_room_id),
    user_id NUMBER(10) REFERENCES users(user_id),
    message_content VARCHAR(255),
    sent_date DATE DEFAULT SYSDATE
);

CREATE SEQUENCE message_sequence 
  START WITH 1 
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;
  
CREATE OR REPLACE TRIGGER messages_before_insert
BEFORE INSERT ON messages
FOR EACH ROW
BEGIN
  IF :new.message_id IS NULL THEN
    SELECT message_sequence.NEXTVAL INTO :new.message_id FROM dual;
  END IF;
END;
/

INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 1, 'Welcome to the Listening Lounge! What’s on your mind?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 1, 'In the Compassion Corner, let’s share something uplifting today!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 3, 'Welcome to the Achievement Arena! What achievements are you proud of?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 2, 'Hey everyone! The Sunny Side Up chat is all about positivity!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 4, 'Feeling accomplished today! What’s your latest win?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 5, 'Good vibes only in the Sunny Side Up! What made you smile today?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 6, 'Hello! Let’s listen to some great stories together.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 7, 'Compassion Corner is the place for kindness! Share your thoughts.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 4, 'What sunny moments are you celebrating today?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 5, 'Share your latest accomplishments with us! Every step counts.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 7, 'What’s bringing you joy today in the Sunny Side Up?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 7, 'Let’s motivate each other with our achievements!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 3, 'What’s a recent experience that made you happy?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 1, 'What music do you enjoy listening to while relaxing?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 1, 'Let’s share acts of kindness we’ve witnessed recently.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 3, 'What’s the proudest moment you’ve had this week?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 2, 'What’s one thing that brightened your day?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 4, 'Celebrate your progress! What have you achieved lately?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 5, 'Sunny vibes all around! What are you excited about?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 6, 'Let’s talk about our favorite relaxation techniques.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 7, 'Compassion makes the world go round! What’s your story?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 4, 'Let’s share our sunny moments from this week!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 5, 'What goals are you working towards this month?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 7, 'Let’s spread positivity! What’s your happy thought?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 7, 'Share your successes, no matter how small!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 3, 'How are you all feeling today? Let’s chat!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 1, 'What podcasts do you recommend for a relaxing listen?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 1, 'Compassionate thoughts can make a big difference!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 3, 'Motivation is key! What motivates you to achieve?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 2, 'How do you keep your spirits high on tough days?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 4, 'What are you celebrating this week? Let’s share!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 5, 'Sunny thoughts brighten any day! What are yours?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 6, 'What’s your go-to song for a mood boost?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 7, 'Compassion is essential! How do you show kindness?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 4, 'Let’s talk about the little things that make us happy!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 5, 'Every achievement matters! What’s yours?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 7, 'What’s your happy place? Let’s share some joy!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 7, 'Success stories inspire! Share yours with us.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 3, 'How do you handle stress? Let’s discuss.');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 1, 'I enjoy hearing everyone’s experiences! What’s yours?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 1, 'Let’s create a chain of kindness here!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 3, 'What’s one personal goal you are excited about?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 2, 'Let’s brighten each other’s day with positivity!');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(3, 4, 'What small victories are you proud of this week?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(2, 5, 'Sunny days inspire creativity! What are your plans?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(1, 6, 'Do you have a favorite quote that lifts your spirits?');
INSERT INTO messages(chat_room_id, user_id, message_content) VALUES(4, 7, 'Let’s share stories that warm our hearts!');
