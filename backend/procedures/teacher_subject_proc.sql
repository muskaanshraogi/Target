DELIMITER $

DROP PROCEDURE IF EXISTS teacher_subject$
CREATE PROCEDURE teacher_subject(IN teacher varchar(50), IN subjectName varchar(200), IN rolName varchar(30), IN divi int, IN aYear varchar(8))

BEGIN
    DECLARE roleId int;
    DECLARE subjectId varchar(20);

    SELECT subId INTO subjectId FROM subject WHERE subName=subjectName AND acadYear=aYear;
    SELECT role_id INTO roleId FROM role WHERE roleName=rolName;

    INSERT INTO faculty VALUES(teacher, roleId, subjectId, divi, 0, aYear);
END$

DELIMITER ;