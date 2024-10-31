CREATE TABLE form_tags (
    form_id NUMBER REFERENCES form_data(form_id) ON DELETE CASCADE, 
    tag_id NUMBER REFERENCES tags(tag_id),
    PRIMARY KEY (form_id, tag_id)
);

SELECT * FROM form_tags;