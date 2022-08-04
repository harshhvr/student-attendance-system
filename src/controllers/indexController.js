// indexController.js

const bcrypt = require("bcryptjs");
const mysql = require("mysql");
const { signinSchema } = require("../models/signinSchema");

const _admin_email = process.env.ADMIN_EMAIL || "admin@example.com";

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// ========== Index Access Controls ==========

// GET '/'

exports.viewHomepage = (req, res, next) => {
  try {
    if (
      req.session.user &&
      (req.session.user.userType === "admin" || "teacher" || "student")
    ) {
      res.render("index", {
        title: "Home",
        dir: { parent: `/${req.session.user.userType}` },
        dataObj: {
          showBigBanner: true,
          signInStatus: true,
          user: req.session.user || {},
          req: req,
        },
        // breadcrumbItems: [{ link: "/", name: "Home" }],
      });
    } else {
      res.render("index", {
        title: "Home",
        dataObj: {
          showBigBanner: true,
          signInStatus: false,
          user: req.session.user || {},
          req: req,
        },
        // breadcrumbItems: [{ link: "/", name: "Home" }],
      });
    }
  } catch (err) {
    console.log(err);
  }
};

// Get Signin Form
exports.viewSignInForm = (req, res) => {
  try {
    res.render("signin", {
      title: "Sign in",
      dataObj: { user: req.session.user },
      breadcrumbItems: [{ link: "/", name: "Home" }],
      alert: {},
    });
  } catch (err) {
    console.log(err);
  }
};

// Signin
exports.signin = async (req, res) => {
  try {
    const schemaValidation = await signinSchema
      .validateAsync(req.body)
      .then((result) => {
        // Connect to DB
        pool.getConnection((err, connection) => {
          if (err) throw err;
          console.log("Connected as ID: " + connection.threadId);

          if (result.user_type === "admin") {
            connection.query(
              "SELECT * FROM ADMIN WHERE Aid = ?",
              [result.user_id],
              (err, rows) => {
                connection.release();

                if (err) {
                  console.log(err);
                  res.render("signin", {
                    title: "Sign in",
                    dataObj: {
                      user: req.session.user || {},
                    },
                    breadcrumbItems: [{ link: "/", name: "Home" }],
                    alert: {
                      danger: err,
                    },
                  });
                } else {
                  if (Object.keys(rows).length === 0) {
                    res.render("signin", {
                      title: "Sign in",
                      dataObj: {
                        user: req.session.user || {},
                      },
                      breadcrumbItems: [{ link: "/", name: "Home" }],
                      alert: {
                        danger: "Invalid user id or password!",
                      },
                    });
                  } else {
                    let schemaRows = rows;
                    schemaRows = schemaRows.map((value, index) => {
                      value = { ...value, ...{ Role: "admin" } };
                      return value;
                    });

                    schemaRows.filter(async function (admin) {
                      // Validate Password
                      const validPassword = await bcrypt.compare(
                        result.user_password,
                        admin.Password
                      );

                      console.log("validPassword", validPassword);

                      if (validPassword) {
                        const user = {
                          userType: result.user_type,
                          userId: admin.Aid,
                          password: admin.Password,
                          signInStatus: true,
                          data: admin,
                          accessLevel:
                            admin.Email === _admin_email
                              ? "full-access"
                              : "special-access",
                        };
                        const dir = { parent: "/admin" };
                        req.session.user = user;
                        req.session.dir = dir;
                        res.redirect("/admin");
                      } else {
                        res.render("signin", {
                          title: "Sign in",
                          dataObj: {
                            user: req.session.user || {},
                          },
                          breadcrumbItems: [{ link: "/", name: "Home" }],
                          alert: {
                            danger: "Invalid password!",
                          },
                        });
                      }
                    });
                  }
                }

                console.log("The data from admin table:\n", rows);
              }
            );
          }

          if (result.user_type === "teacher") {
            connection.query(
              "SELECT * FROM TEACHER WHERE Tid = ?",
              [result.user_id],
              (err, rows) => {
                connection.release();

                if (err) {
                  console.log(err);
                  res.render("signin", {
                    title: "Sign in",
                    dataObj: {
                      user: req.session.user || {},
                    },
                    breadcrumbItems: [{ link: "/", name: "Home" }],
                    alert: {
                      danger: err,
                    },
                  });
                } else {
                  if (Object.keys(rows).length === 0) {
                    res.render("signin", {
                      title: "Sign in",
                      dataObj: {
                        user: req.session.user || {},
                      },
                      breadcrumbItems: [{ link: "/", name: "Home" }],
                      alert: {
                        danger: "Invalid user id or password!",
                      },
                    });
                  } else {
                    let schemaRows = rows;
                    schemaRows = schemaRows.map((value, index) => {
                      value = { ...value, ...{ Role: "teacher" } };
                      return value;
                    });

                    schemaRows.filter(async function (teacher) {
                      // Validate Password
                      const validPassword = await bcrypt.compare(
                        result.user_password,
                        teacher.Password
                      );

                      console.log("validPassword", validPassword);

                      if (validPassword) {
                        const user = {
                          userType: result.user_type,
                          userId: teacher.Tid,
                          password: teacher.Password,
                          signInStatus: true,
                          data: teacher,
                        };
                        const dir = { parent: "/teacher" };
                        req.session.user = user;
                        req.session.dir = dir;
                        res.redirect("/teacher");
                      } else {
                        res.render("signin", {
                          title: "Sign in",
                          dataObj: {
                            user: req.session.user || {},
                          },
                          breadcrumbItems: [{ link: "/", name: "Home" }],
                          alert: {
                            danger: "Invalid password!",
                          },
                        });
                      }
                    });
                  }
                }

                console.log("The data from teacher table:\n", rows);
              }
            );
          }

          if (result.user_type === "student") {
            connection.query(
              "SELECT * FROM STUDENT WHERE Sid = ?",
              [result.user_id],
              (err, rows) => {
                connection.release();

                if (err) {
                  console.log(err);
                  res.render("signin", {
                    title: "Sign in",
                    dataObj: {
                      user: req.session.user || {},
                    },
                    breadcrumbItems: [{ link: "/", name: "Home" }],
                    alert: {
                      danger: err,
                    },
                  });
                } else {
                  if (Object.keys(rows).length === 0) {
                    res.render("signin", {
                      title: "Sign in",
                      dataObj: {
                        user: req.session.user || {},
                      },
                      breadcrumbItems: [{ link: "/", name: "Home" }],
                      alert: {
                        danger: "Invalid user id or password!",
                      },
                    });
                  } else {
                    let schemaRows = rows;
                    schemaRows = schemaRows.map((value, index) => {
                      value = { ...value, ...{ Role: "student" } };
                      return value;
                    });

                    schemaRows.filter(async function (student) {
                      // Validate Password
                      const validPassword = await bcrypt.compare(
                        result.user_password,
                        student.Password
                      );

                      console.log("validPassword", validPassword);

                      if (validPassword) {
                        const user = {
                          userType: result.user_type,
                          userId: student.Sid,
                          password: student.Password,
                          signInStatus: true,
                          data: student,
                        };
                        const dir = { parent: "/student" };
                        req.session.user = user;
                        req.session.dir = dir;
                        res.redirect("/student");
                      } else {
                        res.render("signin", {
                          title: "Sign in",
                          dataObj: {
                            user: req.session.user || {},
                          },
                          breadcrumbItems: [{ link: "/", name: "Home" }],
                          alert: {
                            danger: "Invalid password!",
                          },
                        });
                      }
                    });
                  }
                }

                console.log("The data from student table:\n", rows);
              }
            );
          }
        });
      })
      .catch((err) => {
        res.render("signin", {
          title: "Sign in",
          dataObj: {
            user: req.session.user || {},
          },
          breadcrumbItems: [{ link: "/", name: "Home" }],
          alert: {
            danger: err.details[0].message,
          },
        });
      });
  } catch (err) {
    console.log(err);
  }
};

// Sign out
exports.signout = (req, res) => {
  try {
    req.session.destroy(() => {
      console.log("User logged out.");
    });
    res.redirect("/signin");
  } catch (err) {
    console.log(err);
  }
};

// ========== Access Controls ==========

exports.checkSignOut = (req, res, next) => {
  if (!req.session.user) {
    next(); //If session exists, proceed to page
  } else if (req.session.user) {
    res.redirect(`/${req.session.user.userType}`);
  } else {
    // const err = new Error("Not logged in!");

    // res.render("error", {
    //   title: "Error",
    //   message: err.message,
    //   error: {
    //     status: 400,
    //     stack: err.stack,
    //   },
    // });

    console.log(req);

    next();
  }

  // next();
};
