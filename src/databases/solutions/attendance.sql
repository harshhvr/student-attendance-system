-- attendance.sql
use student_attendance_system;
--
-- #1
\ ! echo #Attendance Relation
--
select *
from attendance \ p;
--
-- #2
--
select *
from attendance
where Date = '2022-05-26';
--
-- #3
--
select *
from attendance
where Sid = 'DE21649';
--
-- #4
--
select *
from attendance
where Course_code = 'AIR4C1';
--
-- #5
--
select *
from attendance
where Sid = 'DE21648'
    AND Course_code = 'AIR4C1';
--
-- #
--
select Course_code,
    sum(
        case
            when Present = 'present' then 1
            else 0
        end
    ) as Present,
    sum(
        case
            when Present = 'absent' then 1
            else 0
        end
    ) as Absent
from attendance
where Sid = 'DE20539'
    AND Course_code = 'AIR4C1';
--
-- #
--
select Course_code,
    sum(
        case
            when Present = 'present' then 1
            else 0
        end
    ) as Present,
    sum(
        case
            when Present = 'absent' then 1
            else 0
        end
    ) as Absent,
    (
        sum(
            case
                when Present = 'present' then 1
                else 0
            end
        ) * 100
    ) /(
        sum(
            case
                when Present = 'present' then 1
                else 0
            end
        ) + sum(
            case
                when Present = 'absent' then 1
                else 0
            end
        )
    ) as Attendance_percent
from attendance
where Sid = 'DE20539'
    AND Course_code = 'AIR4C1';
--
-- #
--
select Course_code,
    sum(
        case
            when Present = 'present' then 1
            else 0
        end
    ) as Present,
    sum(
        case
            when Present = 'absent' then 1
            else 0
        end
    ) as Absent,
    round(
        (
            sum(
                case
                    when Present = 'present' then 1
                    else 0
                end
            ) * 100
        ) /(
            sum(
                case
                    when Present = 'present' then 1
                    else 0
                end
            ) + sum(
                case
                    when Present = 'absent' then 1
                    else 0
                end
            )
        ),
        2
    ) as Attendance_percent
from attendance
where Sid = 'DE20539'
    AND Course_code = 'AIR4C1';
--
-- #
--
Select attendance.Course_code,
    Sum(
        Case
            When attendance.Present = 'present' Then 1
            Else 0
        End
    ) As Present,
    Sum(
        Case
            When attendance.Present = 'absent' Then 1
            Else 0
        End
    ) As Absent,
    ROUND(
        (
            Sum(
                Case
                    When attendance.Present = 'present' Then 1
                    Else 0
                End
            ) * 100
        ) / (
            Sum(
                Case
                    When attendance.Present = 'present' Then 1
                    Else 0
                End
            ) + Sum(
                Case
                    When attendance.Present = 'absent' Then 1
                    Else 0
                End
            )
        ),
        2
    ) As Attendance_percent
From attendance
    Inner Join course On attendance.Course_code = course.Course_code
Where attendance.Sid = 'DE20539'
    And attendance.Course_code = course.Course_code
Group By attendance.Course_code,
    course.Course_code;