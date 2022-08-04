// teacher router

const express = require("express");
const router = express.Router();
const teacherController = require("../src/controllers/teacherController");

//
// GET Requests

router.get("/", (req, res, next) => {
  res.redirect("/teacher/dashboard");
});
router.get(
  "/dashboard",
  teacherController.checkSignIn,
  teacherController.viewTeacherDashboard
);

router.get(
  "/profile",
  teacherController.checkSignIn,
  teacherController.viewTeacherProfile
);

router.get(
  "/class-list",
  teacherController.checkSignIn,
  teacherController.viewClassList
);
router.get(
  "/taken-classes-list",
  teacherController.checkSignIn,
  teacherController.viewTakenClassesList
);
router.get(
  "/manage-attendance",
  teacherController.checkSignIn,
  teacherController.checkStatus,
  teacherController.manageAttendanceForm
);

router.get(
  "/class-list/view-students/:prog/:dept/:class/:section",
  teacherController.checkSignIn,
  teacherController.viewClassStudentsList
);

//
// POST Requests

router.post(
  "/class-list",
  teacherController.checkSignIn,
  teacherController.findClass
);
router.post(
  "/taken-classes-list",
  teacherController.checkSignIn,
  teacherController.findTakenClasses
);
router.post(
  "/manage-attendance",
  teacherController.checkSignIn,
  teacherController.checkStatus,
  teacherController.findLectureToTakeAttendance
);

router.post(
  "/manage-attendance/attendance-form",
  teacherController.checkSignIn,
  teacherController.checkStatus,
  teacherController.addAttendanceFormByTeacher
);
router.post(
  "/manage-attendance/view-attendance",
  teacherController.checkSignIn,
  teacherController.checkStatus,
  teacherController.viewAttendanceToManage
);

router.post(
  "/manage-attendance/attendance-form/submit",
  teacherController.checkSignIn,
  teacherController.checkStatus,
  teacherController.submitAttendance
);

// Export routers
module.exports = router;
