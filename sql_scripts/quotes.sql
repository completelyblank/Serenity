CREATE TABLE quotes (
    quoteid NUMBER PRIMARY KEY,
    quote VARCHAR2(500) NOT NULL, 
    category VARCHAR2(20) NOT NULL REFERENCES quote_categories(category), 
    author VARCHAR2(30) NOT NULL 
);