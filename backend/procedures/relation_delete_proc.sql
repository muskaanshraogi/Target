DELIMITER $

DROP PROCEDURE IF EXISTS relation_delete$
CREATE PROCEDURE relation_delete(IN teacher varchar(50), IN subjectName varchar(200), IN divi int, IN aYear varchar(8))

BEGIN
    DECLARE subjectId varchar(20);

    SELECT subId INTO subjectId FROM subject WHERE subName=subjectName AND acadYear=aYear;

    DELETE FROM faculty WHERE reg_id=teacher AND subId=subjectId AND division=divi AND acadYear=aYear;
END$

DELIMITER ;