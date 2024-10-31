CREATE TABLE form_data (
  form_id NUMBER PRIMARY KEY, 
  user_id NUMBER(10, 0) REFERENCES users(user_id) ON DELETE CASCADE,
  mood_description VARCHAR(100) NOT NULL,
  emoji_id NUMBER REFERENCES emojis(emoji_id) ON DELETE CASCADE,
  submit_date DATE DEFAULT SYSDATE
);

SELECT * FROM form_data;

CREATE SEQUENCE form_sequence 
  START WITH 1 
  INCREMENT BY 1;
  
CREATE OR REPLACE TRIGGER forms_on_insert
  BEFORE INSERT ON form_data
  FOR EACH ROW
BEGIN
  SELECT form_sequence.NEXTVAL
  INTO :new.form_id
  FROM dual;
END;
/