const express = require('express');
const { createCollegeSubscription, getAllCollegeSubscription } = require('../controllers/collegeSubscription.controller');
const router = express.Router()

// router.route("/course-info").post(createCourseInfo);
router.route("/college-subscription").post(createCollegeSubscription);
router.route("/college-subscription").get(getAllCollegeSubscription);

module.exports = router;