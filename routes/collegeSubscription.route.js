const express = require('express');
const { createCollegeSubscription } = require('../controllers/collegeSubscription.controller');
const router = express.Router()

// router.route("/course-info").post(createCourseInfo);
router.route("/college-subscription").post(createCollegeSubscription);

module.exports = router;