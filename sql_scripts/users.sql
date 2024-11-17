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

INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('ali_ahmed', 'pass123', 'Ali', 'Ahmed', 'M', 15, 23);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('sana_ali', 'sana@2021', 'Sana', 'Ali', 'F', 30, 25);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('bilal_hasan', 'b!lal45', 'Bilal', 'Hasan', 'M', 5, 27);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('ayesha_khan', 'ay3sha#k', 'Ayesha', 'Khan', 'F', 8, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('umar_saeed', 'usaeed99', 'Umar', 'Saeed', 'M', 20, 28);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('hina_shafiq', 'hina!123', 'Hina', 'Shafiq', 'F', 18, 22);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('zain_abid', 'zainpass', 'Zain', 'Abid', 'M', 13, 26);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('fatima_tariq', 'fatima786', 'Fatima', 'Tariq', 'F', 10, 23);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('salman_qureshi', 'sqpass00', 'Salman', 'Qureshi', 'M', 22, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('rabia_hassan', 'rabia22', 'Rabia', 'Hassan', 'F', 27, 21);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('fahad_siddiqui', 'fahad78', 'Fahad', 'Siddiqui', 'M', 16, 29);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('mariam_sharif', 'mariam@123', 'Mariam', 'Sharif', 'F', 12, 25);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('tariq_jamal', 'tjpass99', 'Tariq', 'Jamal', 'M', 3, 31);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('sara_kamran', 'sara321', 'Sara', 'Kamran', 'F', 11, 22);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('danish_ali', 'danish007', 'Danish', 'Ali', 'M', 19, 27);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('nadia_faheem', 'nadiafaheem', 'Nadia', 'Faheem', 'F', 14, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('osman_malik', 'osman@malik', 'Osman', 'Malik', 'M', 7, 30);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('amna_yaseen', 'amna#1pass', 'Amna', 'Yaseen', 'F', 4, 23);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('kashif_pervaiz', 'kashifpass', 'Kashif', 'Pervaiz', 'M', 25, 28);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('uzma_shahid', 'uzma09', 'Uzma', 'Shahid', 'F', 6, 26);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('waqar_aslam', 'waqar22', 'Waqar', 'Aslam', 'M', 17, 25);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('mehreen_sadiq', 'mehreen78', 'Mehreen', 'Sadiq', 'F', 13, 29);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('aliya_rashid', 'aliya#pass', 'Aliya', 'Rashid', 'F', 5, 21);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('junaid_shafi', 'junaid987', 'Junaid', 'Shafi', 'M', 28, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('maryam_anwar', 'maryam2020', 'Maryam', 'Anwar', 'F', 8, 23);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('faraz_ali', 'farazpass', 'Faraz', 'Ali', 'M', 26, 30);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('nida_kamran', 'nida!kam', 'Nida', 'Kamran', 'F', 9, 27);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('hassan_mirza', 'hassanpass', 'Hassan', 'Mirza', 'M', 2, 22);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('maha_shabbir', 'maha#2021', 'Maha', 'Shabbir', 'F', 18, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('aslam_abbas', 'aslam12', 'Aslam', 'Abbas', 'M', 15, 23);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('saima_khalid', 'saima!88', 'Saima', 'Khalid', 'F', 12, 21);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('arif_shah', 'arif_pass', 'Arif', 'Shah', 'M', 3, 32);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('kiran_ali', 'kiranpass', 'Kiran', 'Ali', 'F', 20, 22);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('adnan_yousaf', 'adnan@2019', 'Adnan', 'Yousaf', 'M', 10, 26);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('noor_fatima', 'noor2023', 'Noor', 'Fatima', 'F', 6, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('mujtaba_haider', 'mujtaba09', 'Mujtaba', 'Haider', 'M', 11, 28);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('erum_naz', 'erum@123', 'Erum', 'Naz', 'F', 9, 25);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('waqar_shaikh', 'waqar1', 'Waqar', 'Shaikh', 'M', 8, 21);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('hiba_asad', 'hiba@pass', 'Hiba', 'Asad', 'F', 13, 29);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('taha_rafiq', 'taha123', 'Taha', 'Rafiq', 'M', 18, 23);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('shazia_khan', 'shazia_khan', 'Shazia', 'Khan', 'F', 14, 30);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('mustafa_ali', 'mustafa22', 'Mustafa', 'Ali', 'M', 16, 26);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('anila_baig', 'anila#pass', 'Anila', 'Baig', 'F', 4, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('haseeb_ahmad', 'haseeb12', 'Haseeb', 'Ahmad', 'M', 7, 27);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('maliha_rafiq', 'maliha99', 'Maliha', 'Rafiq', 'F', 5, 22);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('noman_aziz', 'noman88', 'Noman', 'Aziz', 'M', 29, 28);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('zara_farooq', 'zara!pass', 'Zara', 'Farooq', 'F', 11, 24);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('faisal_mehmood', 'faisalpass', 'Faisal', 'Mehmood', 'M', 21, 25);
INSERT INTO users(username, password, first_name, last_name, gender, token_count, age) VALUES('rabia_nawaz', 'rabia2022', 'Rabia', 'Nawaz', 'F', 3, 23);


SELECT * FROM users;

UPDATE users SET first_name = 'Ahmed', last_name = 'Ali' WHERE first_name = 'Ali' AND last_name = 'Ahmed';
