CREATE TABLE posts(
    post_id NUMBER PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    post_content VARCHAR(1000) NOT NULL, 
    post_date DATE DEFAULT SYSDATE,
    post_category VARCHAR(15)
);

CREATE SEQUENCE post_sequence 
  START WITH 1 
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;
  
CREATE OR REPLACE TRIGGER posts_before_insert
BEFORE INSERT ON posts
FOR EACH ROW
BEGIN
  IF :new.post_id IS NULL THEN
    SELECT post_sequence.NEXTVAL INTO :new.post_id FROM dual;
  END IF;
END;
/

-- General Category Posts
INSERT INTO posts(user_id, post_content, post_category) VALUES(2, 'Welcome to Zen Board. This is the first test post', 'General');
INSERT INTO posts(user_id, post_content, post_category) VALUES(3, 'We are excited to launch this community, feel free to share your thoughts!', 'General');
INSERT INTO posts(user_id, post_content, post_category) VALUES(4, 'Zen Board aims to create a supportive environment for everyone.', 'General');

-- Advice Category Posts
INSERT INTO posts(user_id, post_content, post_category) VALUES(2, 'Feeling stressed? Try focusing on your breath and relax!', 'Advice');
INSERT INTO posts(user_id, post_content, post_category) VALUES(5, 'A daily walk can help clear your mind and improve your mood.', 'Advice');
INSERT INTO posts(user_id, post_content, post_category) VALUES(6, 'Set small achievable goals to improve your mental wellbeing.', 'Advice');

-- Questions Category Posts
INSERT INTO posts(user_id, post_content, post_category) VALUES(7, 'How do you stay motivated when feeling low?', 'Questions');
INSERT INTO posts(user_id, post_content, post_category) VALUES(8, 'What techniques do you use for mindfulness?', 'Questions');
INSERT INTO posts(user_id, post_content, post_category) VALUES(9, 'How do you cope with difficult emotions?', 'Questions');

-- Discussion Category Posts
INSERT INTO posts(user_id, post_content, post_category) VALUES(10, 'Let’s discuss the impact of social media on mental health.', 'Discussion');
INSERT INTO posts(user_id, post_content, post_category) VALUES(11, 'What role does exercise play in mental wellness?', 'Discussion');
INSERT INTO posts(user_id, post_content, post_category) VALUES(12, 'How can meditation help with stress relief?', 'Discussion');

INSERT INTO posts(user_id, post_content, post_category) VALUES(2, 'Life is a journey filled with ups and downs, but its in the struggles that we find our true strength. Every challenge presents an opportunity for growth, and with each step forward, we learn more about ourselves and the world around us. Embrace the journey, for it is not the destination that defines us, but the lessons we learn along the way. Keep pushing forward, stay positive, and trust that brighter days are ahead', 'General');

SELECT * FROM posts;
