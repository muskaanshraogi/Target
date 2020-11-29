DELIMITER $

DROP TRIGGER IF EXISTS teacher_delete$
CREATE TRIGGER teacher_delete
BEFORE DELETE ON staff
FOR EACH ROW
BEGIN
    DECLARE sub VARCHAR(200);
    DECLARE subjectId VARCHAR(20);
    DECLARE submitted DATE;
    DECLARE acad VARCHAR(7);
    DECLARE p VARCHAR(300);
    DECLARE j INT DEFAULT 1;

    DECLARE s CURSOR FOR SELECT subId, submittedOn, acadYear, pathName FROM report WHERE reg_id=old.reg_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET j=0;

    OPEN s;

    WHILE j=1 DO 
        FETCH s INTO subjectId, submitted, acad, p;
        SELECT subName INTO sub FROM subject WHERE subId=subjectId;
        IF j=1 THEN
        	INSERT INTO backup VALUES(sub, submitted, acad, old.firstName, old.lastName, p);
        END IF;
    END WHILE;

    CLOSE s;
END$

DELIMITER ;