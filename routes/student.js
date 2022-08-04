// student router

const express = require("express");
const router = express.Router();
const studentController = require("../src/controllers/studentController");

//
// GET Requests

router.get("/", (req, res, next) => {
  res.redirect("/student/dashboard");
});
router.get(
  "/dashboard",
  studentController.checkSignIn,
  studentController.viewStudentDashboard
);

router.get(
  "/profile",
  studentController.checkSignIn,
  studentController.viewStudentProfile
);

router.get(
  "/view-attendance",
  studentController.checkSignIn,
  studentController.viewAttendanceByStudent
);

//
// POST Requests

// Export routers
module.exports = router;
