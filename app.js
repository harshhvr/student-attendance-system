// app.js

// Import pre-installed modules
const path = require("path");

// Import installed modules
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const hbs = require("handlebars");
const hbsdate = require("handlebars-dateformat");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

// Handlebars helpers
hbs.registerHelper("dateFormat", require("handlebars-dateformat"));
hbs.registerHelper("ifEquals", function (arg1, arg2, options) {
  return arg1 == arg2 ? options.fn(this) : options.inverse(this);
});
hbs.registerHelper("counter", (index) => {
  return index + 1;
});

// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");
const teacherRouter = require("./routes/teacher");
const studentRouter = require("./routes/student");

// Create an express app
const app = express();
const port = process.env.PORT || 3000;

// Path to serve static files
const staticPath = path.join(__dirname, "public");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
  })
);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(
//   session({ secret: "Your secret key", resave: false, saveUninitialized: true })
// );
app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
  })
);

// Middleware to serve static files
app.use("/", express.static(staticPath));

// jQuery

// Middleware to serve jQuery
app.use(
  "/jquery/dist",
  express.static(path.join(__dirname, "node_modules/jquery/dist"))
);

// Bootstrap

// Middleware to serve Bootstrap SCSS
app.use(
  "/bootstrap/scss",
  express.static(path.join(__dirname, "node_modules/bootstrap/scss"))
);
// Middleware to serve Bootstrap CSS
app.use(
  "/bootstrap/dist/css",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css"))
);
// Middleware to serve Bootstrap Icons CSS
app.use(
  "/bootstrap-icons/font",
  express.static(path.join(__dirname, "node_modules/bootstrap-icons/font"))
);
// Middleware to serve Bootstrap JS
app.use(
  "/bootstrap/dist/js",
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js"))
);

// Chart.js

// Middleware to serve Chart.js
app.use(
  "/chart.js/dist",
  express.static(path.join(__dirname, "node_modules/chart.js/dist"))
);

// FlipClock

// Middleware to serve FlipClock
app.use(
  "/flipclock/dist",
  express.static(path.join(__dirname, "node_modules/flipclock/dist"))
);

// Middleware routes
app.use("/", indexRouter);
// app.use("/users", usersRouter);
app.use("/admin", adminRouter);
app.use("/teacher", teacherRouter);
app.use("/student", studentRouter);

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// Connect to DB
pool.getConnection((err, connection) => {
  if (err) throw err;
  console.log("Connected as ID: " + connection.threadId);
});

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to home");
});

app.get("*", (req, res) => {
  const err = new Error("Not Found!");
  res.render("error", {
    title: "Error",
    dir: req.session.dir || {},
    dataObj: {
      signInStatus: true,
      user: req.session.user || {},
    },
    message: err.message,
    error: {
      status: 404,
      stack: err.stack,
    },
  });
});

// Listening to the server
app.listen(port, () => {
  console.log(`\nServer is running on the port: ${port}`);
  console.log(`Homepage: http://localhost:${port}\n`);
});
