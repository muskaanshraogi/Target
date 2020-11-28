DELIMITER $

DROP TRIGGER IF EXISTS teacher_delete$
CREATE TRIGGER teacher_delete
BEFORE DELETE ON staff
FOR EACH ROW
BEGIN
    DECLARE sub VARCHAR(200);
    DECLARE subjectId INT DEFAULT 0;
    DECLARE submitted DATE;
    DECLARE acad VARCHAR(7);
    DECLARE p VARCHAR(300);

    SELECT subId, submittedOn, acadYear, pathName INTO subjectId, submitted, acad, p FROM report WHERE reg_id=old.reg_id;
    SELECT subName INTO sub FROM subject WHERE subId=subjectId;
    INSERT INTO backup VALUES(subName, submitted, acad, old.firstName, old.lastName, p);
END$

DELIMITER ;