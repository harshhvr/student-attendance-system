// teacherController.js

const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const { schemaFunctions } = require("../functions/schema-functions");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ========== Teacher Access Controls ==========

// GET /
exports.viewTeacherDashboard = (req, res) => {
  try {
    res.render("teacher", {
      title: "Dashboard",
      dir: { parent: "/teacher" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
        req: req,
        req: req,
      },
      breadcrumbItems: [{ link: "/home", name: "Home" }],
    });
  } catch (err) {
    console.log(err);
  }
};

// View Teacher Profile
exports.viewTeacherProfile = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM TEACHER WHERE Tid = ?",
        [req.session.user.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            let schemaRows = rows;
            schemaRows = schemaRows.map((value, index) => {
              value = { ...value, ...{ Role: "Teacher" } };
              return value;
            });

            res.render("profile", {
              title: "Profile",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: { teacher: schemaRows },
            });
          }

          console.log("The data from teacher table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Class Controls ==========

// View Class List
exports.viewClassList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqSessionUser = req.session.user
        ? req.session.user
        : { userId: "TEACHER001" };

      connection.query(
        "SELECT DISTINCT Programme, Class, Department, Section FROM TEACHES WHERE Tid = ? ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        [reqSessionUser.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("class-list", {
              title: "Class List",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: schemaFunctions({ classes: rows }),
            });
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Class
exports.findClass = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "TEACHER001" };

    const reqData = req.body;
    const searchTerm = reqData.search;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT DISTINCT Programme, Class, Department, Section FROM TEACHES WHERE Tid = ? AND (Programme LIKE ? OR Class LIKE ? OR Department LIKE ? OR Section LIKE ?) ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        [
          reqSessionUser.userId,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("class-list", {
              title: "Class List",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: schemaFunctions({ classes: rows }),
            });
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// View Taken Classes List
exports.viewTakenClassesList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqSessionUser = req.session.user
        ? req.session.user
        : { userId: "TEACHER001" };

      connection.query(
        "SELECT DISTINCT a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section, count(DISTINCT a.Date) AS Taken_classes FROM ATTENDANCE a, STUDENT s WHERE a.Tid = ? AND a.Sid = s.Sid GROUP BY a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section  ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        [reqSessionUser.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("taken-classes-list", {
              title: "Taken Classes List",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: { classes: rows },
            });
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Taken Classes
exports.findTakenClasses = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "TEACHER001" };

    const reqData = req.body;
    const searchTerm = reqData.search;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT DISTINCT a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section, count(a.Subject_code) AS Taken_classes FROM ATTENDANCE a, STUDENT s WHERE a.Tid = ? AND a.Sid = s.Sid GROUP BY a.Tid, a.Subject_code, s.Programme, s.Department, s.Class, s.Section ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        [
          reqSessionUser.userId,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ],

        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("taken-classes-list", {
              title: "Taken Classes List",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: { classes: rows },
            });
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// View Class Students List
exports.viewClassStudentsList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqParams = req.params;

      connection.query(
        "SELECT * FROM STUDENT WHERE Programme = ? AND Department = ? AND Class = ? AND Section = ?",
        [reqParams.prog, reqParams.dept, reqParams.class, reqParams.section],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("class-students-list", {
              title: "Class Students List",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
                { link: "/teacher/class-list", name: "Class List" },
              ],
              schema: { student: rows, reqParams: [reqParams] },
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

exports.manageAttendanceForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqSessionUser = req.session.user
        ? req.session.user
        : { userId: "TEACHER001" };

      connection.query(
        "SELECT * FROM TEACHES ts, SUBJECT sub WHERE ts.Tid = ? AND ts.Subject_code = sub.Subject_code",
        [reqSessionUser.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("manage-attendance", {
              title: "Manage Attendance",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: schemaFunctions({ classes: rows }),
            });
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.findLectureToTakeAttendance = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "TEACHER001" };

    const reqData = req.body;
    const searchTerm = reqData.search;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM TEACHES ts, SUBJECT sub WHERE ts.Tid = ? AND ts.Subject_code = sub.Subject_code AND (ts.Subject_code LIKE ? OR sub.Subject_name LIKE ? OR ts.Programme LIKE ? OR ts.Class LIKE ? OR ts.Department LIKE ? OR ts.Section LIKE ?)",
        [
          reqSessionUser.userId,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
        ],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("manage-attendance", {
              title: "Manage Attendance",
              dir: req.session.dir || { parent: "/teacher" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
                req: req,
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/teacher", name: "Dashboard" },
              ],
              schema: schemaFunctions({ classes: rows }),
            });
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// View Attendance to Manage
exports.viewAttendanceToManage = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "TEACHER001" };

    const reqData = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT s.Sid, s.Fname, s.Lname, a.Status FROM STUDENT s, ATTENDANCE a WHERE s.Sid = a.Sid AND s.Programme = ? AND s.Class = ? AND s.Department = ? AND s.Section = ? AND a.Subject_code = ? AND a.Date = ? AND a.Tid = ?",
        [
          reqData.programme,
          reqData.class,
          reqData.department,
          reqData.section,
          reqData.subject_code,
          reqData.date,
          reqSessionUser.userId,
        ],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            if (Object.keys(rows).length === 0) {
              this.addAttendanceFormByTeacher(req, res);
            } else {
              res.render("view-attendance-to-manage", {
                title: "View Attendance",
                dir: req.session.dir || { parent: "/teacher" },
                dataObj: {
                  signInStatus: true,
                  user: req.session.user || {},
                  req: req,
                },
                breadcrumbItems: [
                  { link: "/", name: "Home" },
                  { link: "/teacher", name: "Dashboard" },
                  {
                    link: "/teacher/manage-attendance",
                    name: "Manage Attendance",
                  },
                ],
                schema: [
                  schemaFunctions({
                    attendance: rows,
                    reqData: [reqData],
                  }),
                ],
              });
            }
          }

          console.log("The data from class table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.addAttendanceFormByTeacher = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "TEACHER001" };

    const reqData = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      if (err) {
        console.log(err);
      } else {
        connection.query(
          "SELECT ? AS Date, s.Sid, s.Fname, s.Lname, ts.Tid, ts.Subject_code, ? AS Status FROM STUDENT s, TEACHES ts WHERE s.Programme = ts.Programme AND s.Class = ts.Class AND s.Department = ts.Department AND s.Section = ts.Section AND ts.Tid = ? AND ts.Subject_code = ? AND s.Programme = ? AND s.Class = ? AND s.Department = ? AND s.Section = ?",
          [
            reqData.date,
            "absent",
            reqSessionUser.userId,
            reqData.subject_code,
            reqData.programme,
            reqData.class,
            reqData.department,
            reqData.section,
          ],
          (err1, rows1) => {
            connection.release();

            if (err1) {
              console.log(err1);
            } else {
              connection.query(
                "SELECT s.Sid, s.Fname, s.Lname, a.Status FROM STUDENT s, ATTENDANCE a WHERE s.Sid = a.Sid AND s.Programme = ? AND s.Class = ? AND s.Department = ? AND s.Section = ? AND a.Subject_code = ? AND a.Date = ? AND a.Tid = ?",
                [
                  reqData.programme,
                  reqData.class,
                  reqData.department,
                  reqData.section,
                  reqData.subject_code,
                  reqData.date,
                  reqSessionUser.userId,
                ],
                (err2, rows2) => {
                  // connection.release();

                  if (err2) {
                    console.log(err2);
                  } else {
                    if (Object.keys(rows2).length != 0) {
                      res.render("add-attendance-by-teacher", {
                        title: "Add Attendance Form",
                        dir: req.session.dir || { parent: "/teacher" },
                        dataObj: {
                          signInStatus: true,
                          user: req.session.user || {},
                          req: req,
                        },
                        breadcrumbItems: [
                          { link: "/", name: "Home" },
                          { link: "/teacher", name: "Dashboard" },
                          {
                            link: "/teacher/manage-attendance",
                            name: "Manage Attendance",
                          },
                        ],
                        schema: [
                          schemaFunctions({
                            student: rows2,
                            reqData: [reqData],
                          }),
                        ],
                      });
                    } else {
                      rows1.filter((row) => {
                        connection.query(
                          "INSERT INTO ATTENDANCE SET Date = ?, Sid = ?, Tid = ?, Subject_code = ?, Status = ?",
                          [
                            row.Date,
                            row.Sid,
                            row.Tid,
                            row.Subject_code,
                            row.Status,
                          ],
                          (err3, rows3) => {
                            // connection.release();

                            if (err3) {
                              // console.log(err2);
                              console.log(err3.sqlMessage);
                            } else {
                              console.log(rows3);
                            }

                            // console.log("The data from attendance table:", rows3);
                          }
                        );
                      });

                      res.render("add-attendance-by-teacher", {
                        title: "Add Attendance Form",
                        dir: req.session.dir || { parent: "/teacher" },
                        dataObj: {
                          signInStatus: true,
                          user: req.session.user || {},
                          req: req,
                        },
                        breadcrumbItems: [
                          { link: "/", name: "Home" },
                          { link: "/teacher", name: "Dashboard" },
                          {
                            link: "/teacher/manage-attendance",
                            name: "Manage Attendance",
                          },
                        ],
                        schema: [
                          schemaFunctions({
                            student: rows1,
                            reqData: [reqData],
                          }),
                        ],
                      });
                    }
                  }
                }
              );

              console.log("The data from multipe tables:", rows1);
            }
          }
        );
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.submitAttendance = (req, res) => {
  try {
    const reqSessionUser = req.session.user
      ? req.session.user
      : { userId: "TEACHER001" };

    const reqData = req.body;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM ATTENDANCE WHERE Date = ? AND Tid = ? AND Subject_code = ?",
        [reqData.date, reqSessionUser.userId, reqData.subject_code],
        (err1, rows1) => {
          connection.release();

          if (err1) {
            console.log(err1);
          } else {
            rows1.filter((row) => {
              if (
                reqData.student_id &&
                typeof reqData.student_id === "string"
              ) {
                if (reqData.student_id === row.Sid) {
                  connection.query(
                    "UPDATE ATTENDANCE SET Status = ? WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
                    [
                      "present",
                      row.Date,
                      row.Sid,
                      row.Tid,
                      reqData.subject_code,
                    ],
                    (err2, rows2) => {
                      // connection.release();

                      if (err2) {
                        console.log(err2);
                      } else {
                        console.log(row.Sid, "present");
                        console.log("Attendance updated successfully!");
                      }

                      console.log("The data from attendance table:\n", rows2);
                    }
                  );
                } else {
                  connection.query(
                    "UPDATE ATTENDANCE SET Status = ? WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
                    [
                      "absent",
                      row.Date,
                      row.Sid,
                      row.Tid,
                      reqData.subject_code,
                    ],
                    (err2, rows2) => {
                      // connection.release();

                      if (err2) {
                        console.log(err2);
                      } else {
                        console.log(row.Sid, "absent");
                        console.log("Attendance updated successfully!");
                      }

                      console.log("The data from attendance table:\n", rows2);
                    }
                  );
                }
              }

              if (
                reqData.student_id &&
                typeof reqData.student_id === "object"
              ) {
                if (reqData.student_id.indexOf(row.Sid) != -1) {
                  connection.query(
                    "UPDATE ATTENDANCE SET Status = ? WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
                    [
                      "present",
                      row.Date,
                      row.Sid,
                      row.Tid,
                      reqData.subject_code,
                    ],
                    (err2, rows2) => {
                      // connection.release();

                      if (err2) {
                        console.log(err2);
                      } else {
                        console.log(row.Sid, "present");
                        console.log("Attendance updated successfully!");
                      }

                      console.log("The data from attendance table:\n", rows2);
                    }
                  );
                } else {
                  connection.query(
                    "UPDATE ATTENDANCE SET Status = ? WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
                    [
                      "absent",
                      row.Date,
                      row.Sid,
                      row.Tid,
                      reqData.subject_code,
                    ],
                    (err2, rows2) => {
                      // connection.release();

                      if (err2) {
                        console.log(err2);
                      } else {
                        console.log("rows2", rows2);
                        console.log("rows2", rows2);
                        console.log("Attendance updated successfully!");
                      }

                      console.log("The data from attendance table:\n", rows2);
                    }
                  );
                }
              }
            });

            connection.query(
              "SELECT a.Sid, s.Fname, s.Lname, a.Status FROM ATTENDANCE a, STUDENT s WHERE a.Date = ? AND a.Tid = ? AND a.Subject_code = ? AND a.Sid = s.Sid",
              [reqData.date, reqSessionUser.userId, reqData.subject_code],
              (err, rows) => {
                // connection.release();

                if (err) {
                  console.log(err);
                } else {
                  res.render("view-attendance-by-teacher", {
                    title: "View Attendance",
                    dir: req.session.dir || { parent: "/teacher" },
                    dataObj: {
                      signInStatus: true,
                      user: req.session.user || {},
                      req: req,
                    },
                    breadcrumbItems: [
                      { link: "/", name: "Home" },
                      { link: "/teacher", name: "Dashboard" },
                      {
                        link: "/teacher/manage-attendance",
                        name: "Manage Attendance",
                      },
                    ],
                    schema: [
                      schemaFunctions({
                        attendance: rows,
                        reqData: [reqData],
                      }),
                    ],
                  });
                }

                console.log("The data from attendance table:\n", rows);
              }
            );
          }

          console.log("The data from attendance table:\n", rows1);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Access Controls ==========

exports.checkSignIn = (req, res, next) => {
  if (req.session.user && req.session.user.userType === "teacher") {
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
      dir: req.session.dir || { parent: "/teacher" },
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
