DELIMITER $

DROP TRIGGER IF EXISTS subject_delete$
CREATE TRIGGER subject_delete
BEFORE DELETE ON subject
FOR EACH ROW
BEGIN
    DECLARE f, l  VARCHAR(50);
    DECLARE regId VARCHAR(20);
    DECLARE submitted DATE;
    DECLARE acad VARCHAR(7);
    DECLARE p VARCHAR(300);
    DECLARE j INT DEFAULT 1;

    DECLARE s CURSOR FOR SELECT reg_id, submittedOn, acadYear, pathName FROM report WHERE subId=old.subId;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET j=0;

    OPEN s;

    WHILE j=1 DO 
        FETCH s INTO regId, submitted, acad, p;
        SELECT firstName, lastName INTO f, l FROM staff WHERE reg_id=regId;
        IF j=1 THEN
        	INSERT INTO backup VALUES(old.subName, submitted, acad, f, l, p);
        END IF;
    END WHILE;

    CLOSE s;
END$

DELIMITER ;