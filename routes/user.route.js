const express = require('express')
const router = express.Router()
const { registerUser, loginUser, logOut, getUserDetails, forgotPassword, resetPassword, updateUser, getAllCourses_Interlib, getStudentCourses_Interlib, enrollStudentOn_InterlibCourse, verifyUser, verifyCode, sendInvitationMail, interlibSSOLogin, leaderBoardData, getAllUser, enrolledList_Interlib, getSingleUser, deleteUser, registerWithGoogle, registerWithGoogleData, loginWithGoogle, loginWithGoogleData } = require('../controllers/user.controller');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

router.route("/register").post(registerUser);
router.route("/google/register").get(registerWithGoogle);
router.route("/google/register/callback").get(registerWithGoogleData);
router.route('/updateUser').post(updateUser)
router.route("/login").post(loginUser);
router.route("/google/login").get(loginWithGoogle);
router.route("/google/login/callback").get(loginWithGoogleData);
router.route("/logout").get(logOut);
router.route("/me").get(isAuthenticated, getUserDetails);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/verifyUser").post(verifyUser);
router.route("/sendCode").post(verifyCode);
router.route("/invitation").post(sendInvitationMail);
router.route("/user").get(getSingleUser);

// Admin Routes
router.route("/get-all-users").get(getAllUser);
router.route("/delete-user/:id").delete(deleteUser);
router.route("/enrolled-student").post(isAuthenticated, authorizeRoles("Admin"), enrolledList_Interlib);

// Routes for Interlib API's
router.route("/interlibLogin/:email").get(interlibSSOLogin);
// router.route("/generateInterlibToken").post(generateInterlibToken);
router.route("/student_InterlibCourses/:email").get(getStudentCourses_Interlib);
router.route("/all_InterlibCourses").get(getAllCourses_Interlib);
router.route("/enrollStudentOn_Interlib").post(enrollStudentOn_InterlibCourse);
router.route("/leaderBoard").post(isAuthenticated, leaderBoardData);

module.exports = router;