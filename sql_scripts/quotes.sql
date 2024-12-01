CREATE TABLE quotes (
    quoteid NUMBER PRIMARY KEY,
    quote VARCHAR2(500) NOT NULL, 
    category VARCHAR2(20) NOT NULL, 
    author VARCHAR2(30) NOT NULL 
);

SELECT * FROM quotes;