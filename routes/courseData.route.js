const express = require('express');
const { createCourseData, readAllCourseData } = require('../controllers/courseData.controller');
const router = express.Router()

router.route("/course-data").post(createCourseData);
router.route("/all-course-data").get(readAllCourseData);
router.route("/course-data").get(createCourseData);
router.route("/course-data").put(createCourseData);
router.route("/course-data").delete(createCourseData);

module.exports = router;