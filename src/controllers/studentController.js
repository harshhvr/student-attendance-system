// studentController.js

const bcrypt = require("bcryptjs");
const mysql = require("mysql");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ========== Student Access Controls ==========

// GET /
exports.viewStudentDashboard = (req, res) => {
  try {
    res.render("student", {
      title: "Dashboard",
      dir: req.session.dir || { parent: "/student" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
        req: req,
      },
      breadcrumbItems: [{ link: "/", name: "Home" }],
    });
  } catch (err) {
    console.log(err);
  }
};

// View Student Profile
exports.viewStudentProfile = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "DE21648" };

    const reqData = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM STUDENT WHERE Sid = ?",
        [reqSessionUser.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            let schemaRows = rows;
            schemaRows = schemaRows.map((value, index) => {
              value = { ...value, ...{ Role: "Student" } };
              return value;
            });

            res.render("profile", {
              title: "Profile",
              dir: req.session.dir || { parent: "/student" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/student", name: "Dashboard" },
              ],
              schema: { student: schemaRows },
            });
          }

          console.log("The data from student table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Attendance Controls ==========

// View Attendance by Student
exports.viewAttendanceByStudent = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "DE21648" };

    const reqData = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT t1.*, ROUND(((Total_lectures_in_subject * 100) / Total_lectures), 2) AS Attendance_percent FROM (SELECT a.Sid, a.Subject_code, COUNT(a.Subject_code) AS Total_lectures_in_subject, SUM(CASE WHEN a.Status = 'present' THEN 1 ELSE 0 END) AS Total_present, SUM(CASE WHEN a.Status = 'absent' THEN 1 ELSE 0 END) AS Total_absent, ROUND((SUM(CASE WHEN a.Status = 'present' THEN 1 ELSE 0 END) * 100) / (SUM(CASE WHEN a.Status = 'present' THEN 1 ELSE 0 END) + SUM(CASE WHEN a.Status = 'absent' THEN 1 ELSE 0 END)), 2) AS Attendance_percent_in_subject FROM ATTENDANCE a, SUBJECT sub WHERE a.Subject_code = sub.Subject_code GROUP BY a.Sid, a.Subject_code, sub.Subject_code) AS t1, (SELECT t11.Sid, SUM(Total_lectures_in_subject) AS Total_lectures FROM (SELECT a.Sid, a.Subject_code, COUNT(a.Subject_code) AS Total_lectures_in_subject, SUM(CASE WHEN a.Status = 'present' THEN 1 ELSE 0 END) AS Total_present, SUM(CASE WHEN a.Status = 'absent' THEN 1 ELSE 0 END) AS Total_absent, ROUND((SUM(CASE WHEN a.Status = 'present' THEN 1 ELSE 0 END) * 100) / (SUM(CASE WHEN a.Status = 'present' THEN 1 ELSE 0 END) + SUM(CASE WHEN a.Status = 'absent' THEN 1 ELSE 0 END)), 2) AS Attendance_percent_in_subject FROM ATTENDANCE a, SUBJECT sub WHERE a.Subject_code = sub.Subject_code GROUP BY a.Sid, a.Subject_code, sub.Subject_code) AS t11 GROUP BY t11.Sid) AS t2 WHERE t1.Sid = t2.Sid AND t1.Sid = ?",
        [reqSessionUser.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("view-attendance-by-student", {
              title: "View Attendance",
              dir: req.session.dir || { parent: "/student" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/student", name: "Dashboard" },
              ],
              schema: { attendance: rows },
            });
          }

          console.log("The data from attendance table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Access Controls ==========

exports.checkSignIn = (req, res, next) => {
  if (req.session.user && req.session.user.userType === "student") {
    next(); //If session exists, proceed to page
  } else if (req.session.user) {
    res.redirect(`/${req.session.user.userType}`);
  } else {
    const err = new Error("Not logged in!");

    res.render("error", {
      title: "Error",
      message: err.message,
      error: {
        status: 400,
        stack: err.stack,
      },
    });
  }

  // next();
};

exports.checkStatus = (req, res, next) => {
  if (
    req.session.user &&
    req.session.user.data &&
    req.session.user.data.Status === "active"
  ) {
    next(); //If session exists, proceed to page
  } else {
    const err = new Error("Unauthorized Access!");

    res.render("error", {
      title: "Error",
      dir: req.session.dir || { parent: "/student" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
      },
      message: err.message,
      error: {
        status: 400,
        stack: err.stack,
      },
    });
  }

  // next();
};
