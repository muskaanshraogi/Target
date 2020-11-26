DELIMITER $

DROP PROCEDURE IF EXISTS teacher_subject$
CREATE PROCEDURE teacher_subject(IN teacher varchar(50), IN subjectName varchar(200), IN rolName varchar(30), IN divi int)

BEGIN
    DECLARE roleId int;
    DECLARE subjectId varchar(20);
    DECLARE reg varchar(50);

    SELECT subId INTO subjectId FROM subject WHERE subName=subjectName;
    SELECT role_id INTO roleId FROM role WHERE roleName=rolName;

    SELECT reg_id INTO reg FROM faculty WHERE subId=subjectId, division=div;

    IF(!reg) THEN
        INSERT INTO faculty VALUES(teacher, roleId, subjectId, divi);
END$

DELIMITER ;