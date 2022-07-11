-- create-db.sql

-- Drop database if already exists
DROP DATABASE IF EXISTS STUDENT_ATTENDANCE_SYSTEM;

-- Creating STUDENT_ATTENDANCE_SYSTEM Schemas
CREATE DATABASE STUDENT_ATTENDANCE_SYSTEM;

USE STUDENT_ATTENDANCE_SYSTEM;

-- Create ADMIN table
DROP TABLE IF EXISTS ADMIN;
CREATE TABLE ADMIN (
    Aid VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(1000) NOT NULL,
    Fname VARCHAR(255) NOT NULL,
    Lname VARCHAR(255) NOT NULL,
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Admin PRIMARY KEY (Aid),
    CONSTRAINT sk_Admin_Email UNIQUE (Email)
);

-- Create TEACHER table
DROP TABLE IF EXISTS TEACHER;
CREATE TABLE TEACHER (
    Tid VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(1000) NOT NULL,
    Fname VARCHAR(255) NOT NULL,
    Lname VARCHAR(255) NOT NULL,
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Teacher PRIMARY KEY (Tid),
    CONSTRAINT sk_Teacher_Email UNIQUE (Email)
);

-- Create PROGRAMME table
DROP TABLE IF EXISTS PROGRAMME;
CREATE TABLE PROGRAMME (
    Prog_abbr VARCHAR(255) NOT NULL,
    Prog_name VARCHAR(255) NOT NULL,
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Prog PRIMARY KEY (Prog_abbr)
);

-- Create DEPARTMENT table
DROP TABLE IF EXISTS DEPARTMENT;
CREATE TABLE DEPARTMENT (
    -- Dept_code VARCHAR(255) NOT NULL,
    Dept_abbr VARCHAR(255) NOT NULL,
    Dept_name VARCHAR(255) NOT NULL,
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Dept PRIMARY KEY (Dept_abbr)
);

-- Create STUDENT table
DROP TABLE IF EXISTS STUDENT;
CREATE TABLE STUDENT (
    Sid VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    Password VARCHAR(1000) NOT NULL,
    Fname VARCHAR(255) NOT NULL,
    Lname VARCHAR(255) NOT NULL,
    Programme VARCHAR(255) NOT NULL,
    Department VARCHAR(255) NOT NULL,
    Class VARCHAR(255) NOT NULL,
    Section CHAR(1),
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Student PRIMARY KEY (Sid),
    CONSTRAINT sk_Student_Email UNIQUE (Email),
    CONSTRAINT fk_Student_Programme FOREIGN KEY (Programme) REFERENCES PROGRAMME(Prog_abbr) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Student_Department FOREIGN KEY (Department) REFERENCES DEPARTMENT(Dept_abbr) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create SUBJECT table
DROP TABLE IF EXISTS SUBJECT;
CREATE TABLE SUBJECT (
    Subject_code VARCHAR(255) NOT NULL,
    Subject_name VARCHAR(255) NOT NULL,
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Subject PRIMARY KEY (Subject_code)
);

-- Create TEACHES table
DROP TABLE IF EXISTS TEACHES;
CREATE TABLE TEACHES (
    Id INT NOT NULL AUTO_INCREMENT,
    Tid VARCHAR(255) NOT NULL,
    Subject_code VARCHAR(255) NOT NULL,
    Programme VARCHAR(255) NOT NULL,
    Department VARCHAR(255) NOT NULL,
    Class VARCHAR(255) NOT NULL,
    Section VARCHAR(255) NOT NULL,
    Status VARCHAR(255) NOT NULL DEFAULT 'active',
    CONSTRAINT pk_Teaches PRIMARY KEY (id),
    CONSTRAINT fk_Teaches_Tid FOREIGN KEY (Tid) REFERENCES TEACHER(Tid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Teaches_Subject_code FOREIGN KEY (Subject_code) REFERENCES SUBJECT(Subject_code) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Teaches_Programme FOREIGN KEY (Programme) REFERENCES PROGRAMME(Prog_abbr) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Teaches_Department FOREIGN KEY (Department) REFERENCES DEPARTMENT(Dept_abbr) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create ATTENDANCE table
DROP TABLE IF EXISTS ATTENDANCE;
CREATE TABLE ATTENDANCE (
    Date DATE,
    Sid VARCHAR(255) NOT NULL,
    Tid VARCHAR(255) NOT NULL,
    Subject_code VARCHAR(255) NOT NULL,
    Status VARCHAR(120) NOT NULL,
    CONSTRAINT pk_Attendance PRIMARY KEY (Date, Sid, Tid, Subject_code),
    CONSTRAINT fk_Attendance_Sid FOREIGN KEY (Sid) REFERENCES STUDENT(Sid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Attendance_Tid FOREIGN KEY (Tid) REFERENCES TEACHER(Tid) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Attendance_Subject_code FOREIGN KEY (Subject_code) REFERENCES SUBJECT(Subject_code) ON DELETE CASCADE ON UPDATE CASCADE
);



-- Insert all the values


-- INSERT INTO ADMIN VALUES (Aid, Email, Password, Fname, Lname, Status);
INSERT INTO ADMIN (Aid, Email, Password, Fname, Lname, Status)
VALUES ('admin', 'admin@email.com',	'$2a$10$93zqAoqqT2qb/zYwNZBC1Oofq.T0A4oZ3x/DpgWBWIrMPngGyq2hu', 'Admin', 'Admin', 'active'),
('admin-m', 'johndoe@example.com',	'$2a$10$93zqAoqqT2qb/zYwNZBC1Oofq.T0A4oZ3x/DpgWBWIrMPngGyq2hu', 'John', 'Doe', 'blocked'),
('admin-f', 'janedoe@example.com',	'$2a$10$93zqAoqqT2qb/zYwNZBC1Oofq.T0A4oZ3x/DpgWBWIrMPngGyq2hu', 'Jane', 'Doe', 'blocked'),
('ADMIN001', 'harsh.hvr2017@gmail.com',	'$2a$10$93zqAoqqT2qb/zYwNZBC1Oofq.T0A4oZ3x/DpgWBWIrMPngGyq2hu', 'Harsh Verdhan', 'Raj', 'blocked'),
('ADMIN002', 'devrajtrivedi2003@gmail.com',	'$2a$10$93zqAoqqT2qb/zYwNZBC1Oofq.T0A4oZ3x/DpgWBWIrMPngGyq2hu', 'Devraj', 'Trivedi', 'blocked'),
('ADMIN003', 'shivammalviya2580@gmail.com',	'$2a$10$93zqAoqqT2qb/zYwNZBC1Oofq.T0A4oZ3x/DpgWBWIrMPngGyq2hu', 'Shivam', 'Malviya', 'blocked');


-- INSERT INTO TEACHER VALUES (Tid, Email, Password, Fname, Lname, Status);
INSERT INTO TEACHER (Tid, Email, Password, Fname, Lname)
VALUES ('TEACHER001', 'teacher001@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Dr. Rohit', 'Pathak'),
    ('TEACHER002', 'teacher002@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Er. Mrs. Nilema', 'Karankar'),
    ('TEACHER003', 'teacher003@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Dr. Mrs. Meena', 'Sharma'),
    ('TEACHER004', 'teacher004@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Dr. Vaibhav', 'Jain'),
    ('TEACHER005', 'teacher005@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Er. Shailendra', 'Pathak'),
    ('TEACHER006', 'teacher006@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Er. Vikas', 'Vankhede'),
    ('TEACHER007', 'teacher008@gmail.com', '$2a$10$xFkEcfTRKg6hQTLyZZWYMOklwiZKw8TsV2l6FEwlp8wyyeWlGrVPe', 'Dr. Kamna', 'Lad');


-- INSERT INTO PROGRAMME VALUES (Prog_abbr, Prog_name, Status);
INSERT INTO PROGRAMME (Prog_abbr, Prog_name)
VALUES ('BE', 'Bachelor of Engineering'),
    ('ME', 'Master of Engineering');


-- INSERT INTO DEPARTMENT VALUES (Dept_abbr, Dept_name, Status);
INSERT INTO DEPARTMENT (Dept_abbr, Dept_name)
VALUES ('CE', 'Computer Engineering'),
    ('IT', 'Information Technology'),
    ('E&I', 'Electronics & Instumentation Engineering'),
    ('E&TC', 'Electronics & TeleCommunication Engineering'),
    ('Mech', 'Mechanical Engineering'),
    ('Civil', 'Civil Engineering'),
    ('Applied', 'Applied Science');
   

-- INSERT INTO STUDENT VALUES (Sid, Email, Password, Fname, Lname, Programme, Department, Class, Section, Status);
INSERT INTO STUDENT (Sid, Email, Password, Fname, Lname, Programme, Department, Class, Section)
VALUES ('DE21642', '21bit081@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Aditi', 'Shukla', 'BE', 'IT', '2', 'A'),
    ('DE21643', '21bit181@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Amit Kumar', 'Gontiya', 'BE', 'IT', '2', 'B'),
    ('DE21644', '21bit082@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Ankita', 'Oswal', 'BE', 'IT', '2', 'A'),
    ('DE21645', '21bit182@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Arnav Yogesh', 'Vaishnav', 'BE', 'IT', '2', 'B'),
    ('DE21646', '21bit183@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Astitva Pratap Singh', 'Tomar', 'BE', 'IT', '2', 'B'),
    ('DE21647', '21bit083@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Devraj', 'Trivedi', 'BE', 'IT', '2', 'A'),
    ('DE21648', '21bit084@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Harsh Verdhan', 'Raj', 'BE', 'IT', '2', 'A'),
    ('DE21649', '21bit186@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Komal', 'Shinde', 'BE', 'IT', '2', 'B'),
    ('DE21650', '21bit085@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Reetesh Kumar', 'Pandey', 'BE', 'IT', '2', 'A'),
    ('DE21651', '21bit184@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Samiksha', 'Hanotiya', 'BE', 'IT', '2', 'B'),
    ('DE21652', '21bit086@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Shlok', 'Jaiswal', 'BE', 'IT', '2', 'A'),
    ('DE21653', '21bit185@ietdavv.edu.in', '$2a$10$TN9m/HcQJGAH0LDTQik8tepNgh.7hTG7gjSKxcEjY996nGp4AhL06', 'Tisha', 'Singh', 'BE', 'IT', '2', 'B');


-- INSERT INTO SUBJECT VALUES (Subject_code, Subject_name, Status);
-- INSERT INTO SUBJECT (Subject_code, Subject_name)
-- VALUES ('AIR4C1', 'Numerical & Optimization Techniques'),
--     ('ITR4C2', 'Operating System');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('AIR4C1', 'Numerical & Optimization Techniques', 'active');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('ITR4C2', 'Operating System', 'active');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('ITR4C3', 'Software Engineering', 'active');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('ITR4C4', 'Database Management System', 'active');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('ITR4G2', 'Digital Communication Engineering', 'active');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('ITR4L2', 'Smart Systems Lab', 'active');
INSERT INTO SUBJECT (Subject_code,Subject_name,Status) VALUES ('SIR4S4', 'Communication Skills', 'active');


-- INSERT INTO TEACHES VALUES (Id, Tid, Subject_code, Programme, Department, Class, Section, Status);
-- INSERT INTO TEACHES (Tid, Subject_code, Programme, Department, Class, Section)
-- VALUES ('TEACHER001', 'AIR4C1', 'BE', 'IT', '2', 'A'),
--     ('TEACHER001', 'AIR4C1', 'BE', 'IT', '2', 'B'),
--     ('TEACHER003', 'AIR4C1', 'BE', 'IT', '2', 'B'),
--     ('TEACHER001', 'ITR4C2', 'BE', 'IT', '2', 'A'),
--     ('TEACHER001', 'ITR4C2', 'BE', 'IT', '2', 'B');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER001', 'AIR4C1', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER001', 'AIR4C1', 'BE', 'IT', '2', 'B', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER002', 'ITR4C2', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER002', 'ITR4C2', 'BE', 'IT', '2', 'B', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER003', 'ITR4C3', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER003', 'ITR4C3', 'BE', 'IT', '2', 'B', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER004', 'ITR4C4', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER004', 'ITR4C4', 'BE', 'IT', '2', 'B', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER005', 'ITR4G2', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER005', 'ITR4G2', 'BE', 'IT', '2', 'B', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER006', 'ITR4L2', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER006', 'ITR4L2', 'BE', 'IT', '2', 'B', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER007', 'SIR4S4', 'BE', 'IT', '2', 'A', 'active');
INSERT INTO TEACHES (Tid,Subject_code,Programme,Department,Class,Section,Status) VALUES ('TEACHER007', 'SIR4S4', 'BE', 'IT', '2', 'B', 'active');



-- INSERT INTO ATTENDANCE VALUES (Date, Sid, Tid, Subject_code, Status);
-- INSERT INTO ATTENDANCE (Date, Sid, Tid, Subject_code, Status)
-- VALUES (CURDATE(), 'DE21647', 'TEACHER001', 'AIR4C1', 'present'),
--     (CURDATE(), 'DE21648', 'TEACHER001', 'AIR4C1', 'present'),
--     (CURDATE(), 'DE21644', 'TEACHER001', 'AIR4C1', 'present'),
--     (CURDATE(), 'DE21643', 'TEACHER002', 'AIR4C1', 'present'),
--     (CURDATE(), 'DE21645', 'TEACHER002', 'AIR4C1', 'present'),
--     (CURDATE(), 'DE21647', 'TEACHER001', 'ITR4C2', 'present'),
--     (CURDATE(), 'DE21648', 'TEACHER001', 'ITR4C2', 'present'),
--     (CURDATE(), 'DE21644', 'TEACHER001', 'ITR4C2', 'present'),
--     (CURDATE(), 'DE21643', 'TEACHER001', 'ITR4C2', 'present'),
--     (CURDATE(), 'DE21645', 'TEACHER001', 'ITR4C2', 'present');
-- INSERT INTO ATTENDANCE (Date, Sid, Tid, Subject_code, Status)
-- VALUES ('2022-06-13', 'DE21647', 'TEACHER001', 'AIR4C1', 'present'),
--     ('2022-06-14', 'DE21648', 'TEACHER001', 'AIR4C1', 'present'),
--     ('2022-06-15', 'DE21644', 'TEACHER001', 'AIR4C1', 'present'),
--     ('2022-06-13', 'DE21643', 'TEACHER002', 'AIR4C1', 'present'),
--     ('2022-06-13', 'DE21645', 'TEACHER002', 'AIR4C1', 'present'),
--     ('2022-06-13', 'DE21647', 'TEACHER002', 'ITR4C2', 'present'),
--     ('2022-06-15', 'DE21648', 'TEACHER002', 'ITR4C2', 'present'),
--     ('2022-06-14', 'DE21644', 'TEACHER002', 'ITR4C2', 'present'),
--     ('2022-06-13', 'DE21643', 'TEACHER001', 'ITR4C2', 'present'),
--     ('2022-06-13', 'DE21645', 'TEACHER001', 'ITR4C2', 'present');

INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-13', 'DE21647', 'TEACHER001', 'AIR4C1', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-14', 'DE21648', 'TEACHER002', 'AIR4C1', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-15', 'DE21644', 'TEACHER001', 'AIR4C1', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-13', 'DE21643', 'TEACHER001', 'AIR4C1', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-13', 'DE21645', 'TEACHER002', 'AIR4C1', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-13', 'DE21647', 'TEACHER002', 'ITR4C2', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-15', 'DE21648', 'TEACHER001', 'ITR4C2', 'absent');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-14', 'DE21644', 'TEACHER001', 'ITR4C2', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-13', 'DE21643', 'TEACHER001', 'ITR4C2', 'present');
INSERT INTO ATTENDANCE (Date,Sid,Tid,Subject_code,Status) VALUES ('2022-06-13', 'DE21645', 'TEACHER001', 'ITR4C2', 'present');


-- Update some values
-- UPDATE table_name SET field1 = new-value1, field2 = new-value2 [WHERE Clause]

-- Update in ADMIN table
UPDATE ADMIN SET Status = 'blocked' WHERE Aid IN ('ADMIN004', 'ADMIN005');

-- Modify the Attendance table column 'Date' datatype
-- ALTER TABLE ATTENDANCE MODIFY Date TIMESTAMP NOT NULL DEFAULT CURRENT_DATE();

-- Run this query after delete a record in TEACHES table
-- ALTER TABLE TEACHES AUTO_INCREMENT=1;

-- Display the name of all the relations.
SHOW TABLES;

-- Display the description of all the relations.
DESC ADMIN;
DESC TEACHER;
DESC STUDENT;
DESC PROGRAMME;
DESC DEPARTMENT;
DESC SUBJECT;
DESC TEACHES;
DESC ATTENDANCE;

-- Display the data of all the relations to validate.
SELECT *
FROM ADMIN;
SELECT *
FROM TEACHER;
SELECT *
FROM STUDENT;
SELECT *
FROM PROGRAMME;
SELECT *
FROM DEPARTMENT;
SELECT *
FROM SUBJECT;
SELECT *
FROM TEACHES;
SELECT *
FROM ATTENDANCE;