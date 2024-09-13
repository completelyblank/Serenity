CREATE TABLE users (
  user_id NUMBER PRIMARY KEY, 
  username VARCHAR2(30) NOT NULL UNIQUE, 
  password VARCHAR2(30) NOT NULL, 
  first_name VARCHAR2(20) NOT NULL, 
  last_name VARCHAR2(20) NOT NULL, 
  gender VARCHAR2(10) NOT NULL,
  token_count NUMBER DEFAULT 0,
  age NUMBER NOT NULL
);

CREATE SEQUENCE user_sequence 
  START WITH 1 
  INCREMENT BY 1
  NOCACHE
  NOCYCLE;
  
CREATE OR REPLACE TRIGGER users_before_insert
BEFORE INSERT ON users
FOR EACH ROW
BEGIN
  IF :new.user_id IS NULL THEN
    SELECT user_sequence.NEXTVAL INTO :new.user_id FROM dual;
  END IF;
END;
/

INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('zehra_waqar', 'helloworld', 'Zehra', 'Waqar', 'F', '2', '20');
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('amna_shah', 'acer2700', 'Amna', 'Shah', 'F', '12', '21');
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('muhammad_rk', 'simbuh', 'Muhammad', 'Raza Khan', 'M', '25', '22');

SELECT * FROM users;
