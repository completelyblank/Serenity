CREATE TABLE replies(
    reply_id NUMBER PRIMARY KEY,
    user_id NUMBER REFERENCES users(user_id),
    post_id NUMBER REFERENCES posts(post_id) ON DELETE CASCADE,
    reply_date DATE DEFAULT SYSDATE,
    reply_content VARCHAR(1000) NOT NULL
);

CREATE SEQUENCE reply_sequence 
  START WITH 1 
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;
  
CREATE OR REPLACE TRIGGER replies_before_insert
BEFORE INSERT ON replies
FOR EACH ROW
BEGIN
  IF :new.reply_id IS NULL THEN
    SELECT reply_sequence.NEXTVAL INTO :new.reply_id FROM dual;
  END IF;
END;
/

INSERT INTO replies (user_id, post_id, reply_content) 
VALUES (3, 13, 'I completely agree! Life is all about embracing the journey, no matter how tough it gets. Keep moving forward!');

INSERT INTO replies (user_id, post_id, reply_content) 
VALUES (4, 13, 'Such an inspiring message! Every setback is just a setup for a bigger comeback. Thanks for sharing!');

INSERT INTO replies (user_id, post_id, reply_content) 
VALUES (5, 13, 'This is exactly what I needed to hear today. Life can be overwhelming at times, but we need to remember that the tough times shape us.');

INSERT INTO replies (user_id, post_id, reply_content) 
VALUES (6, 13, 'I love how you framed this. The struggles we face really help us grow into better versions of ourselves. So true!');

INSERT INTO replies (user_id, post_id, reply_content) 
VALUES (7, 13, 'Beautifully written. It’s important to remember that challenges are opportunities in disguise. Stay positive and keep pushing forward!');

INSERT INTO replies (user_id, post_id, reply_content) 
VALUES (8, 13, 'I needed this today. Life definitely feels like a rollercoaster, but its comforting to know that every challenge leads to growth.');

SELECT * FROM replies;