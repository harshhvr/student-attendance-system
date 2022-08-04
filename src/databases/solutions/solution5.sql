
SELECT DISTINCT a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section, count(a.Subject_code) AS Total_classes FROM ATTENDANCE a, STUDENT s WHERE a.Sid = s.Sid GROUP BY a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section;

SELECT DISTINCT a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section, count(a.Subject_code) AS Total_classes FROM ATTENDANCE a, STUDENT s WHERE a.Tid = 'TEACHER001' AND a.Sid = s.Sid GROUP BY a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section;

SELECT DISTINCT a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section, count(a.Subject_code) AS Total_classes FROM ATTENDANCE a, STUDENT s WHERE a.Tid = 'TEACHER001' AND a.Sid = s.Sid GROUP BY a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section  ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC;

SELECT DISTINCT a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section, count(a.Subject_code) AS Total_classes FROM ATTENDANCE a, STUDENT s WHERE a.Tid = ? AND a.Sid = s.Sid GROUP BY a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section  ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC;
