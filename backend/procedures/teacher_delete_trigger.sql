DELIMITER $

DROP TRIGGER IF EXISTS teacher_delete$
CREATE TRIGGER teacher_delete
BEFORE DELETE ON staff
FOR EACH ROW
BEGIN
    DECLARE sub VARCHAR(200);
    DECLARE teacher VARCHAR(50);
    SELECT subName INTO sub FROM subject WHERE 
    INSERT INTO backup VALUES(teacher, sub, old.submittedOn, old.acadYear, old.path)
END$

DELIMITER ;