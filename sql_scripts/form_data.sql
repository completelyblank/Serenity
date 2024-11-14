CREATE TABLE form_data (
  form_id NUMBER PRIMARY KEY, 
  user_id NUMBER(10, 0) REFERENCES users(user_id) ON DELETE CASCADE,
  mood_description VARCHAR(100) NOT NULL,
  emoji_id NUMBER REFERENCES emojis(emoji_id) ON DELETE CASCADE,
  submit_date DATE DEFAULT SYSDATE,
  sentiment VARCHAR(15) NOT NULL
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

INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(1, 'Feeling happy and productive', 1, TIMESTAMP '2024-11-12 09:15:23', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(2, 'A bit tired but still motivated', 2, TIMESTAMP '2024-11-11 18:47:10', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(3, 'Very anxious about upcoming events', 5, TIMESTAMP '2024-11-10 22:30:45', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(4, 'Had a great time with friends today!', 1, TIMESTAMP '2024-11-09 15:05:12', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(5, 'Feeling down, things didn’t go as planned', 5, TIMESTAMP '2024-11-08 08:22:35', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(6, 'Content and peaceful, enjoying the day', 3, TIMESTAMP '2024-11-07 12:55:48', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(7, 'Excited for the weekend ahead!', 1, TIMESTAMP '2024-11-06 16:45:20', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(8, 'Feeling stressed about work', 5, TIMESTAMP '2024-11-05 20:10:07', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(9, 'Just an average day, nothing special', 4, TIMESTAMP '2024-11-04 13:33:14', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(10, 'Had a very productive meeting today!', 1, TIMESTAMP '2024-11-03 10:02:56', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(11, 'A bit under the weather, feeling off', 5, TIMESTAMP '2024-11-02 23:18:30', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(12, 'Relaxed and enjoying some free time', 3, TIMESTAMP '2024-11-01 14:27:43', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(13, 'Had a great workout, feeling strong!', 1, TIMESTAMP '2024-10-31 07:55:12', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(14, 'Feeling sad after watching a movie', 5, TIMESTAMP '2024-10-30 19:43:29', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(15, 'Grateful for a quiet evening at home', 3, TIMESTAMP '2024-10-29 21:11:16', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(16, 'Full of energy and excitement today!', 1, TIMESTAMP '2024-10-28 11:39:50', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(17, 'Feeling overwhelmed with tasks', 5, TIMESTAMP '2024-10-27 18:05:38', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(18, 'A calm, peaceful day without worries', 3, TIMESTAMP '2024-10-26 16:24:02', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(19, 'Excited about new opportunities ahead', 1, TIMESTAMP '2024-10-25 08:59:13', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(20, 'Disappointed by a missed chance', 5, TIMESTAMP '2024-10-24 22:47:09', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(21, 'Relaxed and happy, good day overall', 3, TIMESTAMP '2024-10-23 12:31:45', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(22, 'Excited about a recent success', 1, TIMESTAMP '2024-10-22 14:20:28', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(23, 'Worried about deadlines coming up', 5, TIMESTAMP '2024-10-21 17:45:56', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(24, 'Appreciating the little things today', 3, TIMESTAMP '2024-10-20 11:50:40', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(25, 'Feeling joyful after a great meal', 1, TIMESTAMP '2024-10-19 13:14:55', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(26, 'Exhausted from work, need a break', 5, TIMESTAMP '2024-10-18 21:32:08', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(27, 'A bit bored but not too unhappy', 4, TIMESTAMP '2024-10-17 10:29:15', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(28, 'Feeling motivated to tackle challenges', 1, TIMESTAMP '2024-10-16 16:58:32', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(29, 'Feeling down due to gloomy weather', 5, TIMESTAMP '2024-10-15 20:21:19', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(30, 'Just another regular day at work', 4, TIMESTAMP '2024-10-14 08:45:07', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(31, 'Excited to catch up with old friends', 1, TIMESTAMP '2024-10-13 19:30:44', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(32, 'Feeling very sad and unmotivated', 5, TIMESTAMP '2024-10-12 22:05:25', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(33, 'Calm and composed, having a chill day', 3, TIMESTAMP '2024-10-11 11:18:50', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(34, 'Overjoyed about some good news!', 1, TIMESTAMP '2024-10-10 13:35:12', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(35, 'Frustrated after a rough day at work', 5, TIMESTAMP '2024-10-09 18:27:33', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(36, 'Feeling neutral, just going with the flow', 4, TIMESTAMP '2024-10-08 14:40:48', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(37, 'Proud of myself for reaching a goal', 1, TIMESTAMP '2024-10-07 07:55:21', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(38, 'Feeling anxious about the future', 5, TIMESTAMP '2024-10-06 21:10:16', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(39, 'Pretty relaxed, enjoying some music', 3, TIMESTAMP '2024-10-05 12:43:09', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(40, 'Feeling very grateful today', 1, TIMESTAMP '2024-10-04 10:20:35', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(41, 'Upset after a disagreement with a friend', 5, TIMESTAMP '2024-10-03 20:29:18', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(42, 'Indifferent about the events of the day', 4, TIMESTAMP '2024-10-02 16:32:25', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(43, 'Feeling positive after some meditation', 1, TIMESTAMP '2024-10-01 09:08:54', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(44, 'Worried about some family issues', 5, TIMESTAMP '2024-09-30 22:15:40', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(45, 'Feeling neither good nor bad', 4, TIMESTAMP '2024-09-29 13:23:15', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(46, 'Excited to start a new hobby', 1, TIMESTAMP '2024-09-28 15:14:47', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(47, 'Upset due to some disagreements', 5, TIMESTAMP '2024-09-27 18:41:22', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(48, 'Indifferent about most things today', 4, TIMESTAMP '2024-09-26 11:12:34', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(49, 'Feeling hopeful about the future', 1, TIMESTAMP '2024-09-25 07:44:56', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(50, 'Frustrated with some obstacles', 5, TIMESTAMP '2024-09-24 20:55:39', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(51, 'Relaxed and calm after a long day', 3, TIMESTAMP '2024-09-23 12:05:48', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(52, 'Ecstatic about today’s achievements', 1, TIMESTAMP '2024-09-22 17:22:58', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(53, 'Feeling negative about current events', 5, TIMESTAMP '2024-09-21 21:50:07', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(54, 'Had an average day, not too exciting', 4, TIMESTAMP '2024-09-20 15:30:16', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(55, 'Happy and looking forward to tomorrow', 1, TIMESTAMP '2024-09-19 08:45:23', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(56, 'Upset about something minor', 5, TIMESTAMP '2024-09-18 22:35:42', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(1, 'Feeling energetic and ready for the day', 1, TIMESTAMP '2023-12-12 08:30:00', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(2, 'A little overwhelmed but pushing through', 3, TIMESTAMP '2023-12-12 09:15:23', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(3, 'I’m feeling stressed with the workload', 5, TIMESTAMP '2023-12-12 10:00:45', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(4, 'Great day with some close friends', 1, TIMESTAMP '2023-12-12 11:22:18', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(5, 'Feeling tired and demotivated', 5, TIMESTAMP '2023-12-12 12:45:50', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(6, 'Excited to work on my projects today', 3, TIMESTAMP '2023-12-12 13:30:00', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(7, 'Had a peaceful and relaxing evening', 1, TIMESTAMP '2023-12-12 14:05:05', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(8, 'Feeling frustrated with the current situation', 5, TIMESTAMP '2023-12-12 15:10:15', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(9, 'It’s been a long and tiring day', 4, TIMESTAMP '2023-12-12 16:20:30', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(10, 'Had a productive meeting, feeling positive', 1, TIMESTAMP '2023-12-12 17:00:00', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(11, 'Feeling anxious about upcoming deadlines', 5, TIMESTAMP '2023-12-12 18:35:45', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(12, 'Everything is going smoothly today', 2, TIMESTAMP '2023-12-12 19:15:00', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(13, 'Excited for the weekend ahead', 1, TIMESTAMP '2023-12-12 20:00:00', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(14, 'Disappointed with my progress this week', 5, TIMESTAMP '2023-12-12 21:00:00', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(15, 'Feeling okay, nothing too special today', 3, TIMESTAMP '2023-12-12 22:30:10', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(16, 'Looking forward to tomorrow’s plans', 2, TIMESTAMP '2023-12-12 23:45:00', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(17, 'Stress levels high, need a break', 5, TIMESTAMP '2023-12-11 08:00:00', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(18, 'Feeling optimistic about the day ahead', 1, TIMESTAMP '2023-12-11 09:15:23', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(19, 'A bit under the weather, not my best day', 5, TIMESTAMP '2023-12-11 10:00:45', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(20, 'Had a good conversation with a friend', 2, TIMESTAMP '2023-12-11 11:20:10', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(21, 'Feeling drained, but still hopeful', 5, TIMESTAMP '2023-12-11 12:00:00', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(22, 'Excited for what’s to come this week', 1, TIMESTAMP '2023-12-11 13:10:10', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(23, 'I need a nap, tired but happy', 4, TIMESTAMP '2023-12-11 14:25:30', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(24, 'Ready for a new challenge', 2, TIMESTAMP '2023-12-11 15:05:12', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(25, 'Sad, things are not going the way I hoped', 5, TIMESTAMP '2023-12-11 16:15:45', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(26, 'So much work ahead, but feeling confident', 3, TIMESTAMP '2023-12-11 17:30:00', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(27, 'Content with how things are going', 1, TIMESTAMP '2023-12-11 18:05:45', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(28, 'Frustrated with the lack of progress', 5, TIMESTAMP '2023-12-11 19:30:30', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(29, 'Not much motivation today, feeling lazy', 4, TIMESTAMP '2023-12-11 20:10:00', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(30, 'Feeling confident, got a lot done today', 1, TIMESTAMP '2023-12-11 21:00:10', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(31, 'Anxious, need to clear my mind', 5, TIMESTAMP '2023-12-11 22:25:50', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(32, 'Feeling grateful for what I have', 2, TIMESTAMP '2023-12-11 23:40:00', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(33, 'I’ve got this, feeling positive!', 1, TIMESTAMP '2023-12-10 08:30:00', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(34, 'Stressed, but trying to stay focused', 5, TIMESTAMP '2023-12-10 09:15:23', 'Negative');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(35, 'Relaxed after a busy day', 1, TIMESTAMP '2023-12-10 10:45:50', 'Positive');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(36, 'A bit overwhelmed, but hopeful for progress', 3, TIMESTAMP '2023-12-10 11:55:12', 'Neutral');
INSERT INTO form_data(user_id, mood_description, emoji_id, submit_date, sentiment) VALUES(37, 'Worried about upcoming deadlines', 5, TIMESTAMP '2023-12-10 13:05:10', 'Negative');

