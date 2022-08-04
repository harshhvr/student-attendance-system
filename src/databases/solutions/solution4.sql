

SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1';

SELECT Sid FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1';

SELECT * FROM STUDENT s, ATTENDANCE a WHERE s.Sid = a.Sid AND a.Subject_code = 'AIR4C1' ;


SELECT * FROM STUDENT s WHERE EXISTS(SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1' AND s.Sid = a.Sid);

SELECT * FROM TEACHES t, SELECT * FROM STUDENT s WHERE EXISTS(SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1' AND s.Sid = a.Sid) vt WHERE t.Programme = vt.Programme AND t.Department = vt.Department AND t.Class = vt.Class AND t.Section = vt.Section;

SELECT * FROM TEACHES t WHERE EXISTS(SELECT * FROM STUDENT s WHERE EXISTS(SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1' AND s.Sid = a.Sid AND t.Subject_code = a.Subject_code AND t.Programme = s.Programme AND t.Department = s.Department AND t.Class = s.Class AND t.Section = s.Section));

SELECT t.Id, t.Tid, t.Subject_code, t.Programme, t.Department, t.Class, t.Section FROM TEACHES t WHERE EXISTS(SELECT * FROM STUDENT s WHERE EXISTS(SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1' AND s.Sid = a.Sid AND t.Subject_code = a.Subject_code AND t.Programme = s.Programme AND t.Department = s.Department AND t.Class = s.Class AND t.Section = s.Section));

SELECT t.Id, t.Tid, t.Subject_code, t.Programme, t.Department, t.Class, t.Section, count(a1.Subject_code) FROM TEACHES t, ATTENDANCE a1 WHERE a1.Subject_code = 'AIR4C1' AND EXISTS(SELECT * FROM STUDENT s WHERE EXISTS(SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1' AND s.Sid = a.Sid AND t.Subject_code = a.Subject_code AND t.Programme = s.Programme AND t.Department = s.Department AND t.Class = s.Class AND t.Section = s.Section)) GROUP BY t.Id, t.Tid, t.Subject_code, t.Programme, t.Department, t.Class, t.Section;

SELECT t.Id, t.Tid, t.Subject_code, t.Programme, t.Department, t.Class, t.Section, count(a1.Subject_code) FROM TEACHES t, ATTENDANCE a1 WHERE a1.Subject_code = 'AIR4C1' AND EXISTS(SELECT * FROM STUDENT s WHERE s.Sid = a1.Sid AND EXISTS(SELECT * FROM ATTENDANCE a WHERE a.Subject_code = 'AIR4C1' AND s.Sid = a.Sid AND t.Subject_code = a.Subject_code AND t.Programme = s.Programme AND t.Department = s.Department AND t.Class = s.Class AND t.Section = s.Section)) GROUP BY t.Id, t.Tid, t.Subject_code, t.Programme, t.Department, t.Class, t.Section;
