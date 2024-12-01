CREATE TABLE quote_categories (
    category VARCHAR2(20) PRIMARY KEY,
    emoji_id NUMBER REFERENCES emojis(emoji_id) NOT NULL
);

-- Happy
INSERT INTO quote_categories VALUES('happiness', 1);
INSERT INTO quote_categories VALUES('amazing', 1);
INSERT INTO quote_categories VALUES('cool', 1);
INSERT INTO quote_categories VALUES('success', 1);
INSERT INTO quote_categories VALUES('love', 1);
INSERT INTO quote_categories VALUES('freedom', 1);
INSERT INTO quote_categories VALUES('courage', 1);
INSERT INTO quote_categories VALUES('imagination', 1);
INSERT INTO quote_categories VALUES('intelligence', 1);
INSERT INTO quote_categories VALUES('birthday', 1);

-- Neutral
INSERT INTO quote_categories VALUES('medical', 2);
INSERT INTO quote_categories VALUES('home', 2);
INSERT INTO quote_categories VALUES('education', 2);
INSERT INTO quote_categories VALUES('graduation', 2);
INSERT INTO quote_categories VALUES('food', 2);
INSERT INTO quote_categories VALUES('family', 2);
INSERT INTO quote_categories VALUES('future', 2);
INSERT INTO quote_categories VALUES('fitness', 2);
INSERT INTO quote_categories VALUES('history', 2);
INSERT INTO quote_categories VALUES('computers', 2);

-- Angry
INSERT INTO quote_categories VALUES('anger', 3);
INSERT INTO quote_categories VALUES('failure', 3);
INSERT INTO quote_categories VALUES('fear', 3);
INSERT INTO quote_categories VALUES('alone', 3);
INSERT INTO quote_categories VALUES('government', 3);
INSERT INTO quote_categories VALUES('architecture', 3);
INSERT INTO quote_categories VALUES('car', 3);
INSERT INTO quote_categories VALUES('leadership', 3);
INSERT INTO quote_categories VALUES('business', 3);
INSERT INTO quote_categories VALUES('experience', 3);

-- Sad
INSERT INTO quote_categories VALUES('sad', 4);
INSERT INTO quote_categories VALUES('equality', 4);
INSERT INTO quote_categories VALUES('men', 4);
INSERT INTO quote_categories VALUES('morning', 4);
INSERT INTO quote_categories VALUES('marriage', 4);
INSERT INTO quote_categories VALUES('god', 4);
INSERT INTO quote_categories VALUES('faith', 4);
INSERT INTO quote_categories VALUES('humor', 4);
INSERT INTO quote_categories VALUES('age', 4);
INSERT INTO quote_categories VALUES('forgiveness', 4);

-- Blessed
INSERT INTO quote_categories VALUES('blessed', 5);
INSERT INTO quote_categories VALUES('beauty', 5);
INSERT INTO quote_categories VALUES('health', 5);
INSERT INTO quote_categories VALUES('great', 5);
INSERT INTO quote_categories VALUES('attitude', 5);
INSERT INTO quote_categories VALUES('hope', 5);
INSERT INTO quote_categories VALUES('movies', 5);
INSERT INTO quote_categories VALUES('dad', 5);
INSERT INTO quote_categories VALUES('mom', 5);
INSERT INTO quote_categories VALUES('best', 5);

-- Content
INSERT INTO quote_categories VALUES('content', 6);
INSERT INTO quote_categories VALUES('change', 6);
INSERT INTO quote_categories VALUES('money', 6);
INSERT INTO quote_categories VALUES('friendship', 6);
INSERT INTO quote_categories VALUES('good', 6);
INSERT INTO quote_categories VALUES('life', 6);
INSERT INTO quote_categories VALUES('design', 6);
INSERT INTO quote_categories VALUES('knowledge', 6);
INSERT INTO quote_categories VALUES('communication', 6);
INSERT INTO quote_categories VALUES('funny', 6);