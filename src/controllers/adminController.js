// adminController.js

const bcrypt = require("bcryptjs");
const mysql = require("mysql");

// Import Models
const { addAdminSchema, updateAdminSchema } = require("../models/adminSchema");
const {
  addTeacherSchema,
  updateTeacherSchema,
} = require("../models/teacherSchema");
const {
  addStudentSchema,
  updateStudentSchema,
} = require("../models/studentSchema");
const {
  addProgrammeSchema,
  updateProgrammeSchema,
} = require("../models/programmeSchema");
const {
  addDepartmentSchema,
  updateDepartmentSchema,
} = require("../models/departmentSchema");
const {
  addSubjectSchema,
  updateSubjectSchema,
} = require("../models/subjectSchema");
const {
  addTeachesSchema,
  updateTeachesSchema,
} = require("../models/teachesSchema");

// Import Custom Modules
const { schemaFunctions } = require("../functions/schema-functions");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ========== Admin Controls ==========

// GET /
exports.viewAdminDashboard = (req, res) => {
  try {
    res.render("admin", {
      title: "Dashboard",
      dir: req.session.dir || { parent: "/admin" },
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

// View Admin Profile
exports.viewAdminProfile = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM ADMIN WHERE Aid = ?",
        [req.session.user.userId],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            let schemaRows = rows;
            schemaRows = schemaRows.map((value, index) => {
              value = { ...value, ...{ Role: "Admin" } };
              return value;
            });

            res.render("profile", {
              title: "Profile",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: { admin: schemaRows },
            });
          }

          console.log("The data from admin table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// View Admin List
exports.viewAdminList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query("SELECT * FROM ADMIN", (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
        } else {
          res.render("admin-list", {
            title: "Admin List",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
            ],
            schema: schemaFunctions({ admin: rows }),
          });
        }

        console.log("The data from admin table:\n", rows);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// View Admin
exports.viewAdmin = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM ADMIN WHERE Aid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            let schemaRows = rows;
            schemaRows = schemaRows.map((value, index) => {
              value = { ...value, ...{ Role: "Admin" } };
              return value;
            });

            res.render("view-admin-profile", {
              title: "View Admin Profile",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/admin-list",
                  name: "Admin List",
                },
              ],
              schema: { admin: schemaRows },
            });
          }

          console.log("The data from admin table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Admin
exports.findAdmin = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM ADMIN WHERE Aid LIKE ? OR Fname LIKE ? OR Lname LIKE ? OR Email LIKE ?",
        [
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
            res.render("admin-list", {
              title: "Admin List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ admin: rows }),
            });
          }

          console.log("The data from admin table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Admin Form
exports.addAdminForm = (req, res) => {
  try {
    res.render("add-admin", {
      title: "Add Admin",
      dir: req.session.dir || { parent: "/admin" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
      },
      breadcrumbItems: [
        { link: "/", name: "Home" },
        { link: "/admin", name: "Dashboard" },
        { link: "/admin/admin-list", name: "Admin List" },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Admin Form
exports.editAdminForm = (req, res) => {
  console.log(req.query);
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM ADMIN WHERE Aid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("edit-admin", {
              title: "Edit Admin",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/admin-list",
                  name: "Admin List",
                },
              ],
              schema: { admin: rows },
            });
          }

          console.log("The data from admin table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Admin
exports.addAdmin = (req, res) => {
  try {
    const schemaValidation = addAdminSchema
      .validateAsync(req.body)
      .then(async (result) => {
        // Hash Passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(result.password, salt);

        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "INSERT INTO ADMIN SET Aid = ?, Fname = ?, Lname = ?, Email = ?, Password = ?",
            [
              result.aid,
              result.fname,
              result.lname,
              result.email,
              hashPassword,
            ],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);
                res.render("add-admin", {
                  title: "Add Admin",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/admin-list",
                      name: "Admin List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("add-admin", {
                  title: "Add Admin",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/admin-list",
                      name: "Admin List",
                    },
                  ],
                  alert: {
                    success: "Admin created successfully!",
                  },
                });
              }

              console.log("The data from admin table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        console.log(joi_err);

        if (Object.keys(joi_err.details).length != 0) {
          res.render("add-admin", {
            title: "Add Admin",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
              { link: "/admin/admin-list", name: "Admin List" },
            ],
            alert: { danger: joi_err.details[0].message } || {},
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Admin
exports.updateAdmin = (req, res) => {
  try {
    const schemaValidation = updateAdminSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "UPDATE ADMIN SET Fname = ?, Lname = ?, Email = ? WHERE Aid = ?",
            [result.fname, result.lname, result.email, result.aid],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);
                res.render("edit-admin", {
                  title: "Edit Admin",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/admin-list",
                      name: "Admin List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                // Connect to DB
                pool.getConnection((err, connection) => {
                  if (err) throw err;
                  console.log("Connected as ID: " + connection.threadId);

                  connection.query(
                    "SELECT * FROM ADMIN WHERE Aid = ?",
                    [result.aid],
                    (err, rows) => {
                      connection.release();

                      if (err) {
                        console.log(err);
                      } else {
                        res.render("edit-admin", {
                          title: "Edit Admin",
                          dir: req.session.dir || {
                            parent: "/admin",
                          },
                          dataObj: {
                            signInStatus: true,
                            user: req.session.user || {},
                          },
                          breadcrumbItems: [
                            {
                              link: "/",
                              name: "Home",
                            },
                            {
                              link: "/admin",
                              name: "Admin",
                            },
                            {
                              link: "/admin/admin-list",
                              name: "Admin List",
                            },
                          ],
                          alert: {
                            success: "Admin updated successfully!",
                          },
                          schema: { admin: rows },
                        });
                      }

                      console.log("The data from admin table:\n", rows);
                    }
                  );
                });
              }

              console.log("The data from admin table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        console.log(joi_err);

        if (Object.keys(joi_err.details).length != 0) {
          res.render("edit-admin", {
            title: "Edit Admin",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
              { link: "/admin/admin-list", name: "Admin List" },
            ],
            alert: { danger: joi_err.details[0].message } || {},
          });
        }
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Admin Status
exports.changeAdminStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM ADMIN WHERE Aid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE ADMIN SET Status = ? WHERE Aid = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/admin-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE ADMIN SET Status = ? WHERE Aid = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/admin-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteAdmin = (req, res) => {
  try {
    const reqData = req.params;
    console.log("delete", reqData);

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM ADMIN WHERE Aid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/admin-list");
          }

          console.log("The data from admin table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Teacher Controls ==========

// View Teacher List
exports.viewTeacherList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query("SELECT * FROM TEACHER", (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
        } else {
          res.render("teacher-list", {
            title: "Teacher List",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
            ],
            schema: schemaFunctions({ teacher: rows }),
          });
        }

        console.log("The data from teacher table:\n", rows);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// View Teacher
exports.viewTeacher = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM TEACHER WHERE Tid = ?",
        [reqData.id],
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

            res.render("view-teacher-profile", {
              title: "View Teacher Profile",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/teacher-list",
                  name: "Teacher List",
                },
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

// Find Teacher
exports.findTeacher = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM TEACHER WHERE Tid LIKE ? OR Fname LIKE ? OR Lname LIKE ? OR Email LIKE ?",
        [
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
            res.render("teacher-list", {
              title: "Teacher List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ teacher: rows }),
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

// Add Teacher Form
exports.addTeacherForm = (req, res) => {
  try {
    res.render("add-teacher", {
      title: "Add Teacher",
      dir: req.session.dir || { parent: "/admin" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
      },
      breadcrumbItems: [
        { link: "/", name: "Home" },
        { link: "/admin", name: "Dashboard" },
        { link: "/admin/teacher-list", name: "Teacher List" },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Teacher Form
exports.editTeacherForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM TEACHER WHERE Tid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("edit-teacher", {
              title: "Edit Teacher",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                { link: "/admin/teacher-list", name: "Teacher List" },
              ],
              schema: { teacher: rows },
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

// Add Teacher
exports.addTeacher = (req, res) => {
  try {
    const schemaValidation = addTeacherSchema
      .validateAsync(req.body)
      .then(async (result) => {
        // Hash Passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(result.password, salt);

        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "INSERT INTO TEACHER SET Tid = ?, Fname = ?, Lname = ?, Email = ?, Password = ?",
            [
              result.tid,
              result.fname,
              result.lname,
              result.email,
              hashPassword,
            ],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);
                res.render("add-teacher", {
                  title: "Add Teacher",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/teacher-list",
                      name: "Teacher List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("add-teacher", {
                  title: "Add Teacher",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/teacher-list",
                      name: "Teacher List",
                    },
                  ],
                  alert: {
                    success: "Teacher created successfully!",
                  },
                });
              }

              console.log("The data from teacher table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("add-teacher", {
          title: "Add Teacher",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            { link: "/admin/teacher-list", name: "Teacher List" },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Teacher
exports.updateTeacher = (req, res) => {
  try {
    const schemaValidation = updateTeacherSchema
      .validateAsync(req.body)
      .then(async (result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "UPDATE TEACHER SET Fname = ?, Lname = ?, Email = ? WHERE Tid = ?",
            [result.fname, result.lname, result.email, result.tid],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);
                res.render("edit-teacher", {
                  title: "Edit Teacher",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/teacher-list",
                      name: "Teacher List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("edit-teacher", {
                  title: "Edit Teacher",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/teacher-list",
                      name: "Teacher List",
                    },
                  ],
                  alert: {
                    success: "Teacher updated successfully!",
                  },
                });
              }

              console.log("The data from teacher table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("edit-teacher", {
          title: "Edit Teacher",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            { link: "/admin/teacher-list", name: "Teacher List" },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Teacher Status
exports.changeTeacherStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM TEACHER WHERE Tid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE TEACHER SET Status = ? WHERE Tid = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/teacher-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE TEACHER SET Status = ? WHERE Tid = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/teacher-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTeacher = (req, res) => {
  try {
    const reqData = req.params;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM TEACHER WHERE Tid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/teacher-list");
          }

          console.log("The data from teacher table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Student Controls ==========

// View Student List
exports.viewStudentList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query("SELECT * FROM STUDENT", (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
        } else {
          res.render("student-list", {
            title: "Student List",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
            ],
            schema: schemaFunctions({ student: rows }),
          });
        }

        console.log("The data from student table:\n", rows);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// View Student
exports.viewStudent = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM STUDENT WHERE Sid = ?",
        [reqData.id],
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

            res.render("view-student-profile", {
              title: "View Student Profile",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/student-list",
                  name: "Student List",
                },
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

// Find Student
exports.findStudent = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM STUDENT WHERE Sid LIKE ? OR Email LIKE ? OR Fname LIKE ? OR Lname LIKE ? OR Programme LIKE ? OR Department LIKE ? OR Class LIKE ? OR Section LIKE ? OR Status LIKE ?",
        [
          `%${searchTerm}%`,
          `%${searchTerm}%`,
          `%${searchTerm}%`,
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
            res.render("student-list", {
              title: "Student List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ student: rows }),
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

// Add Student Form
exports.addStudentForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT DISTINCT Prog_abbr FROM PROGRAMME WHERE Status = ?",
        ["active"],
        (err1, rows1) => {
          // connection.release();

          if (err1) {
            console.log(err1);
          } else {
            connection.query(
              "SELECT DISTINCT Dept_abbr FROM DEPARTMENT WHERE Status = ?",
              ["active"],
              (err2, rows2) => {
                // connection.release();

                if (err2) {
                  console.log(err2);
                } else {
                  res.render("add-student", {
                    title: "Add Student",
                    dir: req.session.dir || {
                      parent: "/admin",
                    },
                    dataObj: {
                      signInStatus: true,
                      user: req.session.user || {},
                    },
                    breadcrumbItems: [
                      { link: "/", name: "Home" },
                      { link: "/admin", name: "Dashboard" },
                      {
                        link: "/admin/student-list",
                        name: "Student List",
                      },
                    ],
                    formInput: {
                      programme: rows1,
                      department: rows2,
                    },
                  });
                }

                console.log("The data from department table:\n", rows2);
              }
            );
          }

          console.log("The data from programme table:\n", rows1);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Student Form
exports.editStudentForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT Sid, Email, Fname, Lname, Programme AS MyProgramme, Department AS MyDepartment, Class AS MyClass, Section AS MySection FROM STUDENT WHERE Sid = ?",
        [reqData.id],
        (err, rows) => {
          // connection.release();

          if (err) {
            console.log(err);
          } else {
            connection.query(
              "SELECT DISTINCT Prog_abbr FROM PROGRAMME WHERE Status = ?",
              ["active"],
              (err1, rows1) => {
                // connection.release();

                if (err1) {
                  console.log(err1);
                } else {
                  connection.query(
                    "SELECT DISTINCT Dept_abbr FROM DEPARTMENT WHERE Status = ?",
                    ["active"],
                    (err2, rows2) => {
                      // connection.release();

                      if (err2) {
                        console.log(err2);
                      } else {
                        let schemaRows = rows;
                        schemaRows = schemaRows.map((value, index) => {
                          value = { ...value, ...{ Role: "Student" } };
                          return value;
                        });
                        schemaRows = schemaRows.map((value, index) => {
                          value = { ...value, ...{ programme: rows1 } };
                          return value;
                        });
                        schemaRows = schemaRows.map((value, index) => {
                          value = { ...value, ...{ department: rows2 } };
                          return value;
                        });

                        console.log(schemaRows);

                        res.render("edit-student", {
                          title: "Edit Student",
                          dir: req.session.dir || {
                            parent: "/admin",
                          },
                          dataObj: {
                            signInStatus: true,
                            user: req.session.user || {},
                          },
                          breadcrumbItems: [
                            { link: "/", name: "Home" },
                            { link: "/admin", name: "Dashboard" },
                            {
                              link: "/admin/student-list",
                              name: "Student List",
                            },
                          ],
                          schema: { student: schemaRows },
                        });
                      }

                      console.log("The data from department table:\n", rows2);
                    }
                  );
                }

                console.log("The data from programme table:\n", rows1);
              }
            );
          }

          console.log("The data from programme table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Student
exports.addStudent = (req, res) => {
  try {
    const schemaValidation = addStudentSchema
      .validateAsync(req.body)
      .then(async (result) => {
        // Hash Passwords
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(result.password, salt);

        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "INSERT INTO STUDENT SET Sid = ?, Fname = ?, Lname = ?, Programme = ?, Department = ?, Class = ?, Section = ?, Email = ?, Password = ?",
            [
              result.sid,
              result.fname,
              result.lname,
              result.programme,
              result.department,
              result.class,
              result.section,
              result.email,
              hashPassword,
            ],
            (err, rows) => {
              // connection.release();

              if (err) {
                console.log(err);

                connection.query(
                  "SELECT DISTINCT Prog_abbr FROM PROGRAMME WHERE Status = ?",
                  ["active"],
                  (err1, rows1) => {
                    // connection.release();

                    if (err1) {
                      console.log(err1);
                    } else {
                      connection.query(
                        "SELECT DISTINCT Dept_abbr FROM DEPARTMENT WHERE Status = ?",
                        ["active"],
                        (err2, rows2) => {
                          // connection.release();

                          if (err2) {
                            console.log(err2);
                          } else {
                            res.render("add-student", {
                              title: "Add Student",
                              dir: req.session.dir || {
                                parent: "/admin",
                              },
                              dataObj: {
                                signInStatus: true,
                                user: req.session.user || {},
                              },
                              breadcrumbItems: [
                                {
                                  link: "/",
                                  name: "Home",
                                },
                                {
                                  link: "/admin",
                                  name: "Admin",
                                },
                                {
                                  link: "/admin/student-list",
                                  name: "Student List",
                                },
                              ],
                              formInput: {
                                programme: rows1,
                                department: rows2,
                              },
                              alert: {
                                danger: err,
                              },
                            });
                          }

                          console.log(
                            "The data from department table:\n",
                            rows2
                          );
                        }
                      );
                    }

                    console.log("The data from programme table:\n", rows1);
                  }
                );
              } else {
                res.render("add-student", {
                  title: "Add Student",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/student-list",
                      name: "Student List",
                    },
                  ],
                  alert: {
                    success: "Student created successfully!",
                  },
                });
              }

              console.log("The data from student table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);
          connection.query(
            "SELECT DISTINCT Prog_abbr FROM PROGRAMME WHERE Status = ?",
            ["active"],
            (err1, rows1) => {
              // connection.release();

              if (err1) {
                console.log(err1);
              } else {
                connection.query(
                  "SELECT DISTINCT Dept_abbr FROM DEPARTMENT WHERE Status = ?",
                  ["active"],
                  (err2, rows2) => {
                    // connection.release();

                    if (err2) {
                      console.log(err2);
                    } else {
                      res.render("add-student", {
                        title: "Add Student",
                        dir: req.session.dir || {
                          parent: "/admin",
                        },
                        dataObj: {
                          signInStatus: true,
                          user: req.session.user || {},
                        },
                        breadcrumbItems: [
                          { link: "/", name: "Home" },
                          {
                            link: "/admin",
                            name: "Admin",
                          },
                          {
                            link: "/admin/student-list",
                            name: "Student List",
                          },
                        ],
                        formInput: {
                          programme: rows1,
                          department: rows2,
                        },
                        alert:
                          {
                            danger: joi_err.details[0].message,
                          } || {},
                      });
                    }

                    console.log("The data from department table:\n", rows2);
                  }
                );
              }

              console.log("The data from programme table:\n", rows1);
            }
          );
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Student
exports.updateStudent = (req, res) => {
  try {
    const schemaValidation = updateStudentSchema
      .validateAsync(req.body)
      .then(async (result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "UPDATE STUDENT SET Fname = ?, Lname = ?, Programme = ?, Department = ?, Class = ?, Section = ?, Email = ? WHERE Sid = ?",
            [
              result.fname,
              result.lname,
              result.programme,
              result.department,
              result.class,
              result.section,
              result.email,
              result.sid,
            ],
            (err, rows) => {
              // connection.release();

              if (err) {
                console.log(err);

                connection.query(
                  "SELECT DISTINCT Prog_abbr FROM PROGRAMME WHERE Status = ?",
                  ["active"],
                  (err1, rows1) => {
                    // connection.release();

                    if (err1) {
                      console.log(err1);
                    } else {
                      connection.query(
                        "SELECT DISTINCT Dept_abbr FROM DEPARTMENT WHERE Status = ?",
                        ["active"],
                        (err2, rows2) => {
                          // connection.release();

                          if (err2) {
                            console.log(err2);
                          } else {
                            res.render("edit-student", {
                              title: "Edit Student",
                              dir: req.session.dir || {
                                parent: "/admin",
                              },
                              dataObj: {
                                signInStatus: true,
                                user: req.session.user || {},
                              },
                              breadcrumbItems: [
                                {
                                  link: "/",
                                  name: "Home",
                                },
                                {
                                  link: "/admin",
                                  name: "Admin",
                                },
                                {
                                  link: "/admin/student-list",
                                  name: "Student List",
                                },
                              ],
                              formInput: {
                                programme: rows1,
                                department: rows2,
                              },
                              alert: {
                                danger: err,
                              },
                            });
                          }

                          console.log(
                            "The data from department table:\n",
                            rows2
                          );
                        }
                      );
                    }

                    console.log("The data from programme table:\n", rows1);
                  }
                );
              } else {
                res.render("edit-student", {
                  title: "Edit Student",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/student-list",
                      name: "Student List",
                    },
                  ],
                  alert: {
                    success: "Student updated successfully!",
                  },
                });
              }

              console.log("The data from student table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);
          connection.query(
            "SELECT DISTINCT Prog_abbr FROM PROGRAMME WHERE Status = ?",
            ["active"],
            (err1, rows1) => {
              // connection.release();

              if (err1) {
                console.log(err1);
              } else {
                connection.query(
                  "SELECT DISTINCT Dept_abbr FROM DEPARTMENT WHERE Status = ?",
                  ["active"],
                  (err2, rows2) => {
                    // connection.release();

                    if (err2) {
                      console.log(err2);
                    } else {
                      res.render("edit-student", {
                        title: "Edit Student",
                        dir: req.session.dir || {
                          parent: "/admin",
                        },
                        dataObj: {
                          signInStatus: true,
                          user: req.session.user || {},
                        },
                        breadcrumbItems: [
                          { link: "/", name: "Home" },
                          {
                            link: "/admin",
                            name: "Admin",
                          },
                          {
                            link: "/admin/student-list",
                            name: "Student List",
                          },
                        ],
                        formInput: {
                          programme: rows1,
                          department: rows2,
                        },
                        alert:
                          {
                            danger: joi_err.details[0].message,
                          } || {},
                      });
                    }

                    console.log("The data from department table:\n", rows2);
                  }
                );
              }

              console.log("The data from programme table:\n", rows1);
            }
          );
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Student Status
exports.changeStudentStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM STUDENT WHERE Sid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE STUDENT SET Status = ? WHERE Sid = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/student-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE STUDENT SET Status = ? WHERE Sid = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/student-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteStudent = (req, res) => {
  try {
    const reqData = req.params;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM STUDENT WHERE Sid = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/student-list");
          }

          console.log("The data from student table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Programme Controls ==========

// View Programme List
exports.viewProgrammeList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query("SELECT * FROM PROGRAMME", (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
        } else {
          res.render("programme-list", {
            title: "Programme List",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
            ],
            schema: schemaFunctions({ programme: rows }),
          });
        }

        console.log("The data from programme table:\n", rows);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// View Programme
exports.viewProgramme = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM PROGRAMME WHERE Prog_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("view-programme", {
              title: "View Programme",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/programme-list",
                  name: "Programme List",
                },
              ],
              schema: { programme: rows },
            });
          }

          console.log("The data from programme table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Programme
exports.findProgramme = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM PROGRAMME WHERE Prog_abbr LIKE ? OR Prog_name LIKE ? OR Status LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("programme-list", {
              title: "Programme List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ programme: rows }),
            });
          }

          console.log("The data from programme table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Programme Form
exports.addProgrammeForm = (req, res) => {
  try {
    res.render("add-programme", {
      title: "Add Programme",
      dir: req.session.dir || { parent: "/admin" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
      },
      breadcrumbItems: [
        { link: "/", name: "Home" },
        { link: "/admin", name: "Dashboard" },
        { link: "/admin/programme-list", name: "Programme List" },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Programme Form
exports.editProgrammeForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM PROGRAMME WHERE Prog_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("edit-programme", {
              title: "Edit Programme",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                { link: "/admin/programme-list", name: "Programme List" },
              ],
              schema: { programme: rows },
            });
          }

          console.log("The data from programme table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Programme
exports.addProgramme = (req, res) => {
  try {
    const schemaValidation = addProgrammeSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "INSERT INTO PROGRAMME SET Prog_abbr = ?, Prog_name = ?",
            [result.prog_abbr, result.prog_name],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);

                res.render("add-programme", {
                  title: "Add Programme",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/programme-list",
                      name: "Programme List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("add-programme", {
                  title: "Add Programme",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/programme-list",
                      name: "Programme List",
                    },
                  ],
                  alert: {
                    success: "Programme created successfully!",
                  },
                });
              }

              console.log("The data from programme table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("add-programme", {
          title: "Add Programme",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            {
              link: "/admin/programme-list",
              name: "Programme List",
            },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Programme
exports.updateProgramme = (req, res) => {
  try {
    const schemaValidation = updateProgrammeSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "UPDATE PROGRAMME SET Prog_abbr = ?, Prog_name = ? WHERE Prog_abbr = ?",
            [result.prog_abbr, result.prog_name, result.prog_abbr],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);

                res.render("edit-programme", {
                  title: "Edit Programme",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/programme-list",
                      name: "Programme List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("edit-programme", {
                  title: "Edit Programme",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/programme-list",
                      name: "Programme List",
                    },
                  ],
                  alert: {
                    success: "Programme updated successfully!",
                  },
                });
              }

              console.log("The data from programme table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("edit-programme", {
          title: "Edit Programme",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            {
              link: "/admin/programme-list",
              name: "Programme List",
            },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Programme Status
exports.changeProgrammeStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM PROGRAMME WHERE Prog_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE PROGRAMME SET Status = ? WHERE Prog_abbr = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/programme-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE PROGRAMME SET Status = ? WHERE Prog_abbr = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/programme-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteProgramme = (req, res) => {
  try {
    const reqData = req.params;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM PROGRAMME WHERE Prog_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/programme-list");
          }

          console.log("The data from programme table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Department Controls ==========

// View Department List
exports.viewDepartmentList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query("SELECT * FROM DEPARTMENT", (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
        } else {
          res.render("department-list", {
            title: "Department List",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
            ],
            schema: schemaFunctions({ department: rows }),
          });
        }

        console.log("The data from department table:\n", rows);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// View Department
exports.viewDepartment = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM DEPARTMENT WHERE Dept_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("view-department", {
              title: "View Department",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/department-list",
                  name: "Department List",
                },
              ],
              schema: { department: rows },
            });
          }

          console.log("The data from department table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Department
exports.findDepartment = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM DEPARTMENT WHERE Dept_abbr LIKE ? OR Dept_name LIKE ? OR Status LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("department-list", {
              title: "Department List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ department: rows }),
            });
          }

          console.log("The data from department table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Department Form
exports.addDepartmentForm = (req, res) => {
  try {
    res.render("add-department", {
      title: "Add Department",
      dir: req.session.dir || { parent: "/admin" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
      },
      breadcrumbItems: [
        { link: "/", name: "Home" },
        { link: "/admin", name: "Dashboard" },
        { link: "/admin/department-list", name: "Department List" },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Department Form
exports.editDepartmentForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM DEPARTMENT WHERE Dept_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("edit-department", {
              title: "Edit Department",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                { link: "/admin/department-list", name: "Department List" },
              ],
              schema: { department: rows },
            });
          }

          console.log("The data from department table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Department
exports.addDepartment = (req, res) => {
  try {
    const schemaValidation = addDepartmentSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "INSERT INTO DEPARTMENT SET Dept_abbr = ?, Dept_name = ?",
            [result.dept_abbr, result.dept_name],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);

                res.render("add-department", {
                  title: "Add Department",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/department-list",
                      name: "Department List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("add-department", {
                  title: "Add Department",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/department-list",
                      name: "Department List",
                    },
                  ],
                  alert: {
                    success: "Department created successfully!",
                  },
                });
              }

              console.log("The data from department table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("add-department", {
          title: "Add Department",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            {
              link: "/admin/department-list",
              name: "Department List",
            },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Department
exports.updateDepartment = (req, res) => {
  try {
    const schemaValidation = updateDepartmentSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "UPDATE DEPARTMENT SET Dept_abbr = ?, Dept_name = ? WHERE Dept_abbr = ?",
            [result.dept_abbr, result.dept_name, result.dept_abbr],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);

                res.render("edit-department", {
                  title: "Edit Department",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/department-list",
                      name: "Department List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("edit-department", {
                  title: "Edit Department",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/department-list",
                      name: "Department List",
                    },
                  ],
                  alert: {
                    success: "Department updated successfully!",
                  },
                });
              }

              console.log("The data from department table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("edit-department", {
          title: "Edit Department",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            {
              link: "/admin/department-list",
              name: "Department List",
            },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Department Status
exports.changeDepartmentStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM DEPARTMENT WHERE Dept_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE DEPARTMENT SET Status = ? WHERE Dept_abbr = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/department-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE DEPARTMENT SET Status = ? WHERE Dept_abbr = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/department-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteDepartment = (req, res) => {
  try {
    const reqData = req.params;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM DEPARTMENT WHERE Dept_abbr = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/department-list");
          }

          console.log("The data from department table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Subject Controls ==========

// View Subject List
exports.viewSubjectList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query("SELECT * FROM SUBJECT", (err, rows) => {
        connection.release();

        if (err) {
          console.log(err);
        } else {
          res.render("subject-list", {
            title: "Subject List",
            dir: req.session.dir || { parent: "/admin" },
            dataObj: {
              signInStatus: true,
              user: req.session.user || {},
            },
            breadcrumbItems: [
              { link: "/", name: "Home" },
              { link: "/admin", name: "Dashboard" },
            ],
            schema: schemaFunctions({ subject: rows }),
          });
        }

        console.log("The data from subject table:\n", rows);
      });
    });
  } catch (err) {
    console.log(err);
  }
};

// View Subject
exports.viewSubject = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM SUBJECT WHERE Subject_code = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("view-subject", {
              title: "View Subject",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                {
                  link: "/admin/subject-list",
                  name: "Subject List",
                },
              ],
              schema: { subject: rows },
            });
          }

          console.log("The data from subject table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Subject
exports.findSubject = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM SUBJECT WHERE Subject_code LIKE ? OR Subject_name LIKE ? OR Status LIKE ?",
        [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("subject-list", {
              title: "Subject List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ subject: rows }),
            });
          }

          console.log("The data from subject table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Subject Form
exports.addSubjectForm = (req, res) => {
  try {
    res.render("add-subject", {
      title: "Add Subject",
      dir: req.session.dir || { parent: "/admin" },
      dataObj: {
        signInStatus: true,
        user: req.session.user || {},
      },
      breadcrumbItems: [
        { link: "/", name: "Home" },
        { link: "/admin", name: "Dashboard" },
        { link: "/admin/subject-list", name: "Subject List" },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Subject Form
exports.editSubjectForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM SUBJECT WHERE Subject_code = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("edit-subject", {
              title: "Edit Subject",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                { link: "/admin/subject-list", name: "Subject List" },
              ],
              schema: { subject: rows },
            });
          }

          console.log("The data from subject table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Subject
exports.addSubject = (req, res) => {
  try {
    const schemaValidation = addSubjectSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "INSERT INTO SUBJECT SET Subject_code = ?, Subject_name = ?",
            [result.subject_code, result.subject_name],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);

                res.render("add-subject", {
                  title: "Add Subject",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/subject-list",
                      name: "Subject List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("add-subject", {
                  title: "Add Subject",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/subject-list",
                      name: "Subject List",
                    },
                  ],
                  alert: {
                    success: "Subject created successfully!",
                  },
                });
              }

              console.log("The data from subject table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("add-subject", {
          title: "Add Subject",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            { link: "/admin/subject-list", name: "Subject List" },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Subject
exports.updateSubject = (req, res) => {
  try {
    const schemaValidation = updateSubjectSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "UPDATE SUBJECT SET Subject_code = ?, Subject_name = ? WHERE Subject_code = ?",
            [result.subject_code, result.subject_name, result.subject_code],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);

                res.render("edit-subject", {
                  title: "Edit Subject",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/subject-list",
                      name: "Subject List",
                    },
                  ],
                  alert: { danger: err },
                });
              } else {
                res.render("edit-subject", {
                  title: "Edit Subject",
                  dir: req.session.dir || {
                    parent: "/admin",
                  },
                  dataObj: {
                    signInStatus: true,
                    user: req.session.user || {},
                  },
                  breadcrumbItems: [
                    { link: "/", name: "Home" },
                    { link: "/admin", name: "Dashboard" },
                    {
                      link: "/admin/subject-list",
                      name: "Subject List",
                    },
                  ],
                  alert: {
                    success: "Subject updated successfully!",
                  },
                });
              }

              console.log("The data from subject table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        res.render("edit-subject", {
          title: "Edit Subject",
          dir: req.session.dir || { parent: "/admin" },
          dataObj: {
            signInStatus: true,
            user: req.session.user || {},
          },
          breadcrumbItems: [
            { link: "/", name: "Home" },
            { link: "/admin", name: "Dashboard" },
            { link: "/admin/subject-list", name: "Subject List" },
          ],
          alert: { danger: joi_err.details[0].message } || {},
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Subject Status
exports.changeSubjectStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM SUBJECT WHERE Subject_code = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE SUBJECT SET Status = ? WHERE Subject_code = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/subject-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE SUBJECT SET Status = ? WHERE Subject_code = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/subject-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteSubject = (req, res) => {
  try {
    const reqData = req.params;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM SUBJECT WHERE Subject_code = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/subject-list");
          }

          console.log("The data from subject table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Teaches Controls ==========

// View Teaches List
exports.viewTeachesList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM TEACHES ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("teaches-list", {
              title: "Teaches List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ teaches: rows }),
            });
          }

          console.log("The data from teaches table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// View Teaches
exports.viewTeaches = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM TEACHES WHERE Id = ? ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("view-teaches", {
              title: "View Teaches",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
                { link: "/admin/teaches-list", name: "Teaches List" },
              ],
              schema: { teaches: rows },
            });
          }

          console.log("The data from teaches table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Find Teaches
exports.findTeaches = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM TEACHES WHERE Tid LIKE ? OR Subject_code LIKE ? OR Programme LIKE ? OR Department LIKE ? OR Class LIKE ? OR Section LIKE ? ORDER BY Tid ASC, Subject_code ASC, Programme ASC, Department ASC, Class ASC, Section ASC",
        [
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
            res.render("teaches-list", {
              title: "Teaches List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ teaches: rows }),
            });
          }

          console.log("The data from teaches table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Teaches Form
exports.addTeachesForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM TEACHER WHERE Status = ?",
        ["active"],
        (err1, rows1) => {
          // connection.release();

          if (err1) {
            console.log(err1);
          } else {
            connection.query(
              "SELECT * FROM SUBJECT WHERE Status = ?",
              ["active"],
              (err2, rows2) => {
                // connection.release();

                if (err2) {
                  console.log(err2);
                } else {
                  connection.query(
                    "SELECT * FROM PROGRAMME WHERE Status = ?",
                    ["active"],
                    (err3, rows3) => {
                      // connection.release();

                      if (err3) {
                        console.log(err3);
                      } else {
                        connection.query(
                          "SELECT * FROM DEPARTMENT WHERE Status = ?",
                          ["active"],
                          (err4, rows4) => {
                            // connection.release();

                            if (err4) {
                              console.log(err4);
                            } else {
                              res.render("add-teaches", {
                                title: "Add Teaches",
                                dir: req.session.dir || {
                                  parent: "/admin",
                                },
                                dataObj: {
                                  signInStatus: true,
                                  user: req.session.user || {},
                                },
                                breadcrumbItems: [
                                  {
                                    link: "/",
                                    name: "Home",
                                  },
                                  {
                                    link: "/admin",
                                    name: "Admin",
                                  },
                                  {
                                    link: "/admin/teaches-list",
                                    name: "Teaches List",
                                  },
                                ],
                                formInput: {
                                  teacher: rows1,
                                  subject: rows2,
                                  programme: rows3,
                                  department: rows4,
                                },
                              });
                            }

                            console.log(
                              "The data from department table:\n",
                              rows4
                            );
                          }
                        );
                      }

                      console.log("The data from programme table:\n", rows3);
                    }
                  );
                }

                console.log("The data from programme table:\n", rows2);
              }
            );
          }

          console.log("The data from programme table:\n", rows1);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Edit Teaches Form
exports.editTeachesForm = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM TEACHES WHERE Id = ?",
        [reqData.id],
        (err, rows) => {
          // connection.release();

          if (err) {
            console.log(err);
          } else {
            connection.query(
              "SELECT * FROM TEACHER WHERE Status = ?",
              ["active"],
              (err1, rows1) => {
                // connection.release();

                if (err1) {
                  console.log(err1);
                } else {
                  connection.query(
                    "SELECT * FROM SUBJECT WHERE Status = ?",
                    ["active"],
                    (err2, rows2) => {
                      // connection.release();

                      if (err2) {
                        console.log(err2);
                      } else {
                        connection.query(
                          "SELECT * FROM PROGRAMME WHERE Status = ?",
                          ["active"],
                          (err3, rows3) => {
                            // connection.release();

                            if (err3) {
                              console.log(err3);
                            } else {
                              connection.query(
                                "SELECT * FROM DEPARTMENT WHERE Status = ?",
                                ["active"],
                                (err4, rows4) => {
                                  // connection.release();

                                  if (err4) {
                                    console.log(err4);
                                  } else {
                                    let schemaRows = rows;
                                    schemaRows = schemaRows.map(
                                      (value, index) => {
                                        value = {
                                          ...value,
                                          ...{ teacher: rows1 },
                                        };
                                        return value;
                                      }
                                    );
                                    schemaRows = schemaRows.map(
                                      (value, index) => {
                                        value = {
                                          ...value,
                                          ...{ subject: rows2 },
                                        };
                                        return value;
                                      }
                                    );
                                    schemaRows = schemaRows.map(
                                      (value, index) => {
                                        value = {
                                          ...value,
                                          ...{ programme: rows3 },
                                        };
                                        return value;
                                      }
                                    );
                                    schemaRows = schemaRows.map(
                                      (value, index) => {
                                        value = {
                                          ...value,
                                          ...{ department: rows4 },
                                        };
                                        return value;
                                      }
                                    );

                                    res.render("edit-teaches", {
                                      title: "Edit Teaches",
                                      dir: req.session.dir || {
                                        parent: "/admin",
                                      },
                                      dataObj: {
                                        signInStatus: true,
                                        user: req.session.user || {},
                                      },
                                      breadcrumbItems: [
                                        {
                                          link: "/",
                                          name: "Home",
                                        },
                                        {
                                          link: "/admin",
                                          name: "Admin",
                                        },
                                        {
                                          link: "/admin/teaches-list",
                                          name: "Teaches List",
                                        },
                                      ],
                                      formInput: {
                                        teaches: schemaRows,
                                      },
                                    });
                                  }

                                  console.log(
                                    "The data from department table:\n",
                                    rows4
                                  );
                                }
                              );
                            }

                            console.log(
                              "The data from programme table:\n",
                              rows3
                            );
                          }
                        );
                      }

                      console.log("The data from programme table:\n", rows2);
                    }
                  );
                }

                console.log("The data from programme table:\n", rows1);
              }
            );
          }

          console.log("The data from programme table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// Add Teaches
exports.addTeaches = (req, res) => {
  try {
    const schemaValidation = addTeachesSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "SELECT * FROM TEACHES WHERE Tid = ? AND Subject_code = ? AND Programme = ? AND Department = ? AND Class = ? AND Section = ?",
            [
              result.tid,
              result.subject_code,
              result.programme,
              result.department,
              result.class,
              result.section,
            ],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);
              } else if (Object.keys(rows).length != 0) {
                connection.query(
                  "SELECT * FROM TEACHER WHERE Status = ?",
                  ["active"],
                  (err1, rows1) => {
                    // connection.release();

                    if (err1) {
                      console.log(err1);
                    } else {
                      connection.query(
                        "SELECT * FROM SUBJECT WHERE Status = ?",
                        ["active"],
                        (err2, rows2) => {
                          // connection.release();

                          if (err2) {
                            console.log(err2);
                          } else {
                            connection.query(
                              "SELECT * FROM PROGRAMME WHERE Status = ?",
                              ["active"],
                              (err3, rows3) => {
                                // connection.release();

                                if (err3) {
                                  console.log(err3);
                                } else {
                                  connection.query(
                                    "SELECT * FROM DEPARTMENT WHERE Status = ?",
                                    ["active"],
                                    (err4, rows4) => {
                                      // connection.release();

                                      if (err4) {
                                        console.log(err4);
                                      } else {
                                        res.render("add-teaches", {
                                          title: "Add Teaches",
                                          dir: req.session.dir || {
                                            parent: "/admin",
                                          },
                                          dataObj: {
                                            signInStatus: true,
                                            user: req.session.user || {
                                              role: "Admin",
                                            },
                                          },
                                          breadcrumbItems: [
                                            {
                                              link: "/",
                                              name: "Home",
                                            },
                                            {
                                              link: "/admin",
                                              name: "Admin",
                                            },
                                            {
                                              link: "/admin/teaches-list",
                                              name: "Teaches List",
                                            },
                                          ],
                                          formInput: {
                                            teacher: rows1,
                                            subject: rows2,
                                            programme: rows3,
                                            department: rows4,
                                          },
                                          alert: {
                                            danger: "Duplicate entry!",
                                          },
                                        });
                                      }

                                      console.log(
                                        "The data from department table:\n",
                                        rows4
                                      );
                                    }
                                  );
                                }

                                console.log(
                                  "The data from programme table:\n",
                                  rows3
                                );
                              }
                            );
                          }

                          console.log(
                            "The data from programme table:\n",
                            rows2
                          );
                        }
                      );
                    }

                    console.log("The data from programme table:\n", rows1);
                  }
                );
              } else {
                // Connect to DB
                pool.getConnection((err, connection) => {
                  if (err) throw err;
                  console.log("Connected as ID: " + connection.threadId);

                  connection.query(
                    "ALTER TABLE TEACHES AUTO_INCREMENT=1",
                    (errOnAlter, rowsOnAlter) => {
                      // connection.release()

                      if (errOnAlter) {
                        console.log(errOnAlter);
                      } else {
                        connection.query(
                          "INSERT INTO TEACHES SET Tid = ?, Subject_code = ?, Programme = ?, Department = ?, Class = ?, Section = ?",
                          [
                            result.tid,
                            result.subject_code,
                            result.programme,
                            result.department,
                            result.class,
                            result.section,
                          ],
                          (errOnInsert, rowsOnInsert) => {
                            // connection.release();

                            if (errOnInsert) {
                              console.log(errOnInsert);

                              connection.query(
                                "SELECT * FROM TEACHER WHERE Status = ?",
                                ["active"],
                                (err1, rows1) => {
                                  // connection.release();

                                  if (err1) {
                                    console.log(err1);
                                  } else {
                                    connection.query(
                                      "SELECT * FROM SUBJECT WHERE Status = ?",
                                      ["active"],
                                      (err2, rows2) => {
                                        // connection.release();

                                        if (err2) {
                                          console.log(err2);
                                        } else {
                                          connection.query(
                                            "SELECT * FROM PROGRAMME WHERE Status = ?",
                                            ["active"],
                                            (err3, rows3) => {
                                              // connection.release();

                                              if (err3) {
                                                console.log(err3);
                                              } else {
                                                connection.query(
                                                  "SELECT * FROM DEPARTMENT WHERE Status = ?",
                                                  ["active"],
                                                  (err4, rows4) => {
                                                    // connection.release();

                                                    if (err4) {
                                                      console.log(err4);
                                                    } else {
                                                      res.render(
                                                        "add-teaches",
                                                        {
                                                          title: "Add Teaches",
                                                          dir: req.session
                                                            .dir || {
                                                            parent: "/admin",
                                                          },
                                                          dataObj: {
                                                            signInStatus: true,
                                                            user: req.session
                                                              .user || {
                                                              role: "Admin",
                                                            },
                                                          },
                                                          breadcrumbItems: [
                                                            {
                                                              link: "/",
                                                              name: "Home",
                                                            },
                                                            {
                                                              link: "/admin",
                                                              name: "Admin",
                                                            },
                                                            {
                                                              link: "/admin/teaches-list",
                                                              name: "Teaches List",
                                                            },
                                                          ],
                                                          formInput: {
                                                            teacher: rows1,
                                                            subject: rows2,
                                                            programme: rows3,
                                                            department: rows4,
                                                          },
                                                          alert: {
                                                            danger: err,
                                                          },
                                                        }
                                                      );
                                                    }

                                                    console.log(
                                                      "The data from department table:\n",
                                                      rows4
                                                    );
                                                  }
                                                );
                                              }

                                              console.log(
                                                "The data from programme table:\n",
                                                rows3
                                              );
                                            }
                                          );
                                        }

                                        console.log(
                                          "The data from programme table:\n",
                                          rows2
                                        );
                                      }
                                    );
                                  }

                                  console.log(
                                    "The data from programme table:\n",
                                    rows1
                                  );
                                }
                              );
                            } else {
                              // Connect to DB
                              pool.getConnection((err, connection) => {
                                if (err) throw err;
                                console.log(
                                  "Connected as ID: " + connection.threadId
                                );

                                connection.query(
                                  "SELECT * FROM TEACHER WHERE Status = ?",
                                  ["active"],
                                  (err1, rows1) => {
                                    // connection.release();

                                    if (err1) {
                                      console.log(err1);
                                    } else {
                                      connection.query(
                                        "SELECT * FROM SUBJECT WHERE Status = ?",
                                        ["active"],
                                        (err2, rows2) => {
                                          // connection.release();

                                          if (err2) {
                                            console.log(err2);
                                          } else {
                                            connection.query(
                                              "SELECT * FROM PROGRAMME WHERE Status = ?",
                                              ["active"],
                                              (err3, rows3) => {
                                                // connection.release();

                                                if (err3) {
                                                  console.log(err3);
                                                } else {
                                                  connection.query(
                                                    "SELECT * FROM DEPARTMENT WHERE Status = ?",
                                                    ["active"],
                                                    (err4, rows4) => {
                                                      // connection.release();

                                                      if (err4) {
                                                        console.log(err4);
                                                      } else {
                                                        res.render(
                                                          "add-teaches",
                                                          {
                                                            title:
                                                              "Add Teaches",
                                                            dir: req.session
                                                              .dir || {
                                                              parent: "/admin",
                                                            },
                                                            dataObj: {
                                                              signInStatus: true,
                                                              user:
                                                                req.session
                                                                  .user || {},
                                                            },
                                                            breadcrumbItems: [
                                                              {
                                                                link: "/",
                                                                name: "Home",
                                                              },
                                                              {
                                                                link: "/admin",
                                                                name: "Admin",
                                                              },
                                                              {
                                                                link: "/admin/teaches-list",
                                                                name: "Teaches List",
                                                              },
                                                            ],
                                                            formInput: {
                                                              teacher: rows1,
                                                              subject: rows2,
                                                              programme: rows3,
                                                              department: rows4,
                                                            },
                                                            alert: {
                                                              success:
                                                                "Teaches created successfully!",
                                                            },
                                                          }
                                                        );
                                                      }

                                                      console.log(
                                                        "The data from department table:\n",
                                                        rows4
                                                      );
                                                    }
                                                  );
                                                }

                                                console.log(
                                                  "The data from programme table:\n",
                                                  rows3
                                                );
                                              }
                                            );
                                          }

                                          console.log(
                                            "The data from programme table:\n",
                                            rows2
                                          );
                                        }
                                      );
                                    }

                                    console.log(
                                      "The data from programme table:\n",
                                      rows1
                                    );
                                  }
                                );
                              });
                              // res.render("add-teaches", {
                              //   title: "Add Teaches",
                              //   dir: req.session.dir || {
                              //     parent: "/admin",
                              //   },
                              //   dataObj: {
                              //     signInStatus: true,
                              //     user: req.session.user || {},
                              //   },
                              //   breadcrumbItems: [
                              //     { link: "/", name: "Home" },
                              //     {
                              //       link: "/admin",
                              //       name: "Admin",
                              //     },
                              //     {
                              //       link: "/admin/teaches-list",
                              //       name: "Teaches List",
                              //     },
                              //   ],
                              //   alert: {
                              //     success: "Teaches created successfully!",
                              //   },
                              // });
                            }

                            console.log(
                              "The data from teaches table:\n",
                              rowsOnInsert
                            );
                          }
                        );
                      }
                    }
                  );
                });
              }

              console.log("The data from teaches table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "SELECT * FROM TEACHER WHERE Status = ?",
            ["active"],
            (err1, rows1) => {
              // connection.release();

              if (err1) {
                console.log(err1);
              } else {
                connection.query(
                  "SELECT * FROM SUBJECT WHERE Status = ?",
                  ["active"],
                  (err2, rows2) => {
                    // connection.release();

                    if (err2) {
                      console.log(err2);
                    } else {
                      connection.query(
                        "SELECT * FROM PROGRAMME WHERE Status = ?",
                        ["active"],
                        (err3, rows3) => {
                          // connection.release();

                          if (err3) {
                            console.log(err3);
                          } else {
                            connection.query(
                              "SELECT * FROM DEPARTMENT WHERE Status = ?",
                              ["active"],
                              (err4, rows4) => {
                                // connection.release();

                                if (err4) {
                                  console.log(err4);
                                } else {
                                  res.render("add-teaches", {
                                    title: "Add Teaches",
                                    dir: req.session.dir || {
                                      parent: "/admin",
                                    },
                                    dataObj: {
                                      signInStatus: true,
                                      user: req.session.user || {
                                        role: "Admin",
                                      },
                                    },
                                    breadcrumbItems: [
                                      {
                                        link: "/",
                                        name: "Home",
                                      },
                                      {
                                        link: "/admin",
                                        name: "Admin",
                                      },
                                      {
                                        link: "/admin/teaches-list",
                                        name: "Teaches List",
                                      },
                                    ],
                                    formInput: {
                                      teacher: rows1,
                                      subject: rows2,
                                      programme: rows3,
                                      department: rows4,
                                    },
                                    alert:
                                      {
                                        danger: joi_err.details[0].message,
                                      } || {},
                                  });
                                }

                                console.log(
                                  "The data from department table:\n",
                                  rows4
                                );
                              }
                            );
                          }

                          console.log(
                            "The data from programme table:\n",
                            rows3
                          );
                        }
                      );
                    }

                    console.log("The data from programme table:\n", rows2);
                  }
                );
              }

              console.log("The data from programme table:\n", rows1);
            }
          );
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Update Teaches
exports.updateTeaches = (req, res) => {
  try {
    const schemaValidation = updateTeachesSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "SELECT * FROM TEACHES WHERE Tid = ? AND Subject_code = ? AND Programme = ? AND Department = ? AND Class = ? AND Section = ?",
            [
              result.tid,
              result.subject_code,
              result.programme,
              result.department,
              result.class,
              result.section,
            ],
            (err, rows) => {
              connection.release();

              if (err) {
                console.log(err);
              } else if (Object.keys(rows).length != 0) {
                connection.query(
                  "SELECT * FROM TEACHER WHERE Status = ?",
                  ["active"],
                  (err1, rows1) => {
                    // connection.release();

                    if (err1) {
                      console.log(err1);
                    } else {
                      connection.query(
                        "SELECT * FROM SUBJECT WHERE Status = ?",
                        ["active"],
                        (err2, rows2) => {
                          // connection.release();

                          if (err2) {
                            console.log(err2);
                          } else {
                            connection.query(
                              "SELECT * FROM PROGRAMME WHERE Status = ?",
                              ["active"],
                              (err3, rows3) => {
                                // connection.release();

                                if (err3) {
                                  console.log(err3);
                                } else {
                                  connection.query(
                                    "SELECT * FROM DEPARTMENT WHERE Status = ?",
                                    ["active"],
                                    (err4, rows4) => {
                                      // connection.release();

                                      if (err4) {
                                        console.log(err4);
                                      } else {
                                        let schemaRows = rows;
                                        schemaRows = schemaRows.map(
                                          (value, index) => {
                                            value = {
                                              ...value,
                                              ...{ teacher: rows1 },
                                            };
                                            return value;
                                          }
                                        );
                                        schemaRows = schemaRows.map(
                                          (value, index) => {
                                            value = {
                                              ...value,
                                              ...{ subject: rows2 },
                                            };
                                            return value;
                                          }
                                        );
                                        schemaRows = schemaRows.map(
                                          (value, index) => {
                                            value = {
                                              ...value,
                                              ...{ programme: rows3 },
                                            };
                                            return value;
                                          }
                                        );
                                        schemaRows = schemaRows.map(
                                          (value, index) => {
                                            value = {
                                              ...value,
                                              ...{ department: rows4 },
                                            };
                                            return value;
                                          }
                                        );

                                        res.render("edit-teaches", {
                                          title: "Edit Teaches",
                                          dir: req.session.dir || {
                                            parent: "/admin",
                                          },
                                          dataObj: {
                                            signInStatus: true,
                                            user: req.session.user || {
                                              role: "Admin",
                                            },
                                          },
                                          breadcrumbItems: [
                                            {
                                              link: "/",
                                              name: "Home",
                                            },
                                            {
                                              link: "/admin",
                                              name: "Admin",
                                            },
                                            {
                                              link: "/admin/teaches-list",
                                              name: "Teaches List",
                                            },
                                          ],
                                          formInput: {
                                            teaches: schemaRows,
                                          },
                                          alert: {
                                            danger: "Duplicate entry!",
                                          },
                                        });
                                      }

                                      console.log(
                                        "The data from department table:\n",
                                        rows4
                                      );
                                    }
                                  );
                                }

                                console.log(
                                  "The data from programme table:\n",
                                  rows3
                                );
                              }
                            );
                          }

                          console.log(
                            "The data from programme table:\n",
                            rows2
                          );
                        }
                      );
                    }

                    console.log("The data from programme table:\n", rows1);
                  }
                );
              } else {
                const reqData = req.params;

                connection.query(
                  "UPDATE TEACHES SET Tid = ?, Subject_code = ?, Programme = ?, Department = ?, Class = ?, Section = ? WHERE Id = ?",
                  [
                    result.tid,
                    result.subject_code,
                    result.programme,
                    result.department,
                    result.class,
                    result.section,
                    reqData.id,
                  ],
                  (errOnUpdate, rowsOnUpdate) => {
                    // connection.release();

                    if (errOnUpdate) {
                      console.log(errOnUpdate);

                      connection.query(
                        "SELECT * FROM TEACHER WHERE Status = ?",
                        ["active"],
                        (err1, rows1) => {
                          // connection.release();

                          if (err1) {
                            console.log(err1);
                          } else {
                            connection.query(
                              "SELECT * FROM SUBJECT WHERE Status = ?",
                              ["active"],
                              (err2, rows2) => {
                                // connection.release();

                                if (err2) {
                                  console.log(err2);
                                } else {
                                  connection.query(
                                    "SELECT * FROM PROGRAMME WHERE Status = ?",
                                    ["active"],
                                    (err3, rows3) => {
                                      // connection.release();

                                      if (err3) {
                                        console.log(err3);
                                      } else {
                                        connection.query(
                                          "SELECT * FROM DEPARTMENT WHERE Status = ?",
                                          ["active"],
                                          (err4, rows4) => {
                                            // connection.release();

                                            if (err4) {
                                              console.log(err4);
                                            } else {
                                              let schemaRows = rows;
                                              schemaRows = schemaRows.map(
                                                (value, index) => {
                                                  value = {
                                                    ...value,
                                                    ...{ teacher: rows1 },
                                                  };
                                                  return value;
                                                }
                                              );
                                              schemaRows = schemaRows.map(
                                                (value, index) => {
                                                  value = {
                                                    ...value,
                                                    ...{ subject: rows2 },
                                                  };
                                                  return value;
                                                }
                                              );
                                              schemaRows = schemaRows.map(
                                                (value, index) => {
                                                  value = {
                                                    ...value,
                                                    ...{ programme: rows3 },
                                                  };
                                                  return value;
                                                }
                                              );
                                              schemaRows = schemaRows.map(
                                                (value, index) => {
                                                  value = {
                                                    ...value,
                                                    ...{ department: rows4 },
                                                  };
                                                  return value;
                                                }
                                              );

                                              res.render("add-teaches", {
                                                title: "Add Teaches",
                                                dir: req.session.dir || {
                                                  parent: "/admin",
                                                },
                                                dataObj: {
                                                  signInStatus: true,
                                                  user: req.session.user || {
                                                    role: "Admin",
                                                  },
                                                },
                                                breadcrumbItems: [
                                                  {
                                                    link: "/",
                                                    name: "Home",
                                                  },
                                                  {
                                                    link: "/admin",
                                                    name: "Admin",
                                                  },
                                                  {
                                                    link: "/admin/teaches-list",
                                                    name: "Teaches List",
                                                  },
                                                ],
                                                formInput: {
                                                  teaches: schemaRows,
                                                },
                                                alert: {
                                                  danger: err,
                                                },
                                              });
                                            }

                                            console.log(
                                              "The data from department table:\n",
                                              rows4
                                            );
                                          }
                                        );
                                      }

                                      console.log(
                                        "The data from programme table:\n",
                                        rows3
                                      );
                                    }
                                  );
                                }

                                console.log(
                                  "The data from programme table:\n",
                                  rows2
                                );
                              }
                            );
                          }

                          console.log(
                            "The data from programme table:\n",
                            rows1
                          );
                        }
                      );
                    } else {
                      res.render("add-teaches", {
                        title: "Add Teaches",
                        dir: req.session.dir || {
                          parent: "/admin",
                        },
                        dataObj: {
                          signInStatus: true,
                          user: req.session.user || {},
                        },
                        breadcrumbItems: [
                          { link: "/", name: "Home" },
                          {
                            link: "/admin",
                            name: "Admin",
                          },
                          {
                            link: "/admin/teaches-list",
                            name: "Teaches List",
                          },
                        ],
                        alert: {
                          success: "Teaches updated successfully!",
                        },
                      });
                    }

                    console.log("The data from teaches table:\n", rowsOnUpdate);
                  }
                );
              }

              console.log("The data from teaches table:\n", rows);
            }
          );
        });
      })
      .catch((joi_err) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          connection.query(
            "SELECT * FROM TEACHER WHERE Status = ?",
            ["active"],
            (err1, rows1) => {
              // connection.release();

              if (err1) {
                console.log(err1);
              } else {
                connection.query(
                  "SELECT * FROM SUBJECT WHERE Status = ?",
                  ["active"],
                  (err2, rows2) => {
                    // connection.release();

                    if (err2) {
                      console.log(err2);
                    } else {
                      connection.query(
                        "SELECT * FROM PROGRAMME WHERE Status = ?",
                        ["active"],
                        (err3, rows3) => {
                          // connection.release();

                          if (err3) {
                            console.log(err3);
                          } else {
                            connection.query(
                              "SELECT * FROM DEPARTMENT WHERE Status = ?",
                              ["active"],
                              (err4, rows4) => {
                                // connection.release();

                                if (err4) {
                                  console.log(err4);
                                } else {
                                  let schemaRows = rows;
                                  schemaRows = schemaRows.map(
                                    (value, index) => {
                                      value = {
                                        ...value,
                                        ...{ teacher: rows1 },
                                      };
                                      return value;
                                    }
                                  );
                                  schemaRows = schemaRows.map(
                                    (value, index) => {
                                      value = {
                                        ...value,
                                        ...{ subject: rows2 },
                                      };
                                      return value;
                                    }
                                  );
                                  schemaRows = schemaRows.map(
                                    (value, index) => {
                                      value = {
                                        ...value,
                                        ...{ programme: rows3 },
                                      };
                                      return value;
                                    }
                                  );
                                  schemaRows = schemaRows.map(
                                    (value, index) => {
                                      value = {
                                        ...value,
                                        ...{ department: rows4 },
                                      };
                                      return value;
                                    }
                                  );

                                  res.render("add-teaches", {
                                    title: "Add Teaches",
                                    dir: req.session.dir || {
                                      parent: "/admin",
                                    },
                                    dataObj: {
                                      signInStatus: true,
                                      user: req.session.user || {
                                        role: "Admin",
                                      },
                                    },
                                    breadcrumbItems: [
                                      {
                                        link: "/",
                                        name: "Home",
                                      },
                                      {
                                        link: "/admin",
                                        name: "Admin",
                                      },
                                      {
                                        link: "/admin/teaches-list",
                                        name: "Teaches List",
                                      },
                                    ],
                                    formInput: {
                                      teaches: schemaRows,
                                    },
                                    alert:
                                      {
                                        danger: joi_err.details[0].message,
                                      } || {},
                                  });
                                }

                                console.log(
                                  "The data from department table:\n",
                                  rows4
                                );
                              }
                            );
                          }

                          console.log(
                            "The data from programme table:\n",
                            rows3
                          );
                        }
                      );
                    }

                    console.log("The data from programme table:\n", rows2);
                  }
                );
              }

              console.log("The data from programme table:\n", rows1);
            }
          );
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Change Teaches Status
exports.changeTeachesStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM TEACHES WHERE Id = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "active") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE TEACHES SET Status = ? WHERE Id = ?",
                  ["blocked", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/teaches-list");
                    }
                  }
                );
              });
            }

            if (row_status === "blocked") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE TEACHES SET Status = ? WHERE Id = ?",
                  ["active", reqData.id],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/teaches-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

exports.deleteTeaches = (req, res) => {
  try {
    const reqData = req.params;

    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "DELETE FROM TEACHES WHERE Id = ?",
        [reqData.id],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.redirect("/admin/teaches-list");
          }

          console.log("The data from teaches table:\n", rows);
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Attendance Controls ==========

// View Attendance List
exports.viewAttendanceList = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      connection.query(
        "SELECT * FROM ATTENDANCE ORDER BY Date DESC, Sid ASC, Tid ASC, Subject_code ASC, Status ASC",
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            res.render("attendance-list", {
              title: "Attendance List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ attendance: rows }),
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

// Find Attendance
exports.findAttendance = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const searchTerm = req.body.search;

      connection.query(
        "SELECT * FROM ATTENDANCE WHERE Date LIKE ? OR Sid LIKE ? OR Tid LIKE ? OR Subject_code LIKE ? ORDER BY Date DESC, Sid ASC, Tid ASC, Subject_code ASC, Status ASC",
        [
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
            res.render("attendance-list", {
              title: "Attendance List",
              dir: req.session.dir || { parent: "/admin" },
              dataObj: {
                signInStatus: true,
                user: req.session.user || {},
              },
              breadcrumbItems: [
                { link: "/", name: "Home" },
                { link: "/admin", name: "Dashboard" },
              ],
              schema: schemaFunctions({ attendance: rows }),
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

// Change Attendance Status
exports.changeAttendanceStatus = (req, res) => {
  try {
    // Connect to DB
    pool.getConnection((err, connection) => {
      if (err) throw err;
      console.log("Connected as ID: " + connection.threadId);

      const reqData = req.params;

      connection.query(
        "SELECT * FROM ATTENDANCE WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
        [reqData.date, reqData.sid, reqData.tid, reqData.subject_code],
        (err, rows) => {
          connection.release();

          if (err) {
            console.log(err);
          } else {
            const row_status = reqData.status;

            if (row_status === "present") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE ATTENDANCE SET Status = ? WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
                  [
                    "absent",
                    reqData.date,
                    reqData.sid,
                    reqData.tid,
                    reqData.subject_code,
                  ],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/attendance-list");
                    }
                  }
                );
              });
            }

            if (row_status === "absent") {
              // Connect to DB
              pool.getConnection((err, connection) => {
                if (err) throw err;
                console.log("Connected as ID: " + connection.threadId);

                const reqData = req.params;

                connection.query(
                  "UPDATE ATTENDANCE SET Status = ? WHERE Date = ? AND Sid = ? AND Tid = ? AND Subject_code = ?",
                  [
                    "present",
                    reqData.date,
                    reqData.sid,
                    reqData.tid,
                    reqData.subject_code,
                  ],
                  (err, rows) => {
                    connection.release();

                    if (err) {
                      console.log(err);
                    } else {
                      console.log(row_status);

                      res.redirect("/admin/attendance-list");
                    }
                  }
                );
              });
            }
          }
        }
      );
    });
  } catch (err) {
    console.log(err);
  }
};

// ========== Access Controls ==========

exports.checkSignIn = (req, res, next) => {
  if (req.session.user && req.session.user.userType === "admin") {
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
      dir: req.session.dir || { parent: "/admin" },
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

exports.checkForFulAccess = (req, res, next) => {
  if (
    req.session.user &&
    req.session.user.accessLevel &&
    req.session.user.accessLevel === "full-access"
  ) {
    next(); //If session exists, proceed to page
  } else {
    const err = new Error("Unauthorized Access!");

    res.render("error", {
      title: "Error",
      dir: req.session.dir || { parent: "/admin" },
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

exports.restrictActionsForOwn = (req, res, next) => {
  console.log(req.params.id);
  if (
    req.session.user &&
    req.session.user.data &&
    req.session.user.data.Aid != req.params.id
  ) {
    next(); //If session exists, proceed to page
  } else {
    const err = new Error("Unauthorized Access!");

    res.render("error", {
      title: "Error",
      dir: req.session.dir || { parent: "/admin" },
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

exports.restrictActionsForOthers = (req, res, next) => {
  console.log(req.params.id);
  if (
    req.session.user &&
    req.session.user.data &&
    req.session.user.data.Aid === req.params.id
  ) {
    next(); //If session exists, proceed to page
  } else {
    const err = new Error("Unauthorized Access!");

    res.render("error", {
      title: "Error",
      dir: req.session.dir || { parent: "/admin" },
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
