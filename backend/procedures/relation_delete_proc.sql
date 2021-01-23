DELIMITER $

DROP PROCEDURE IF EXISTS relation_delete$
CREATE PROCEDURE relation_delete(IN teacher varchar(50), IN subjectName varchar(200), IN divi int)

BEGIN
    DECLARE subjectId varchar(20);

    SELECT subId INTO subjectId FROM subject WHERE subName=subjectName;

    DELETE FROM faculty WHERE reg_id=teacher AND subId=subjectId AND division=divi;
END$

DELIMITER ;