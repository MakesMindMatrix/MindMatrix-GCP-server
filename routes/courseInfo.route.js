const express = require('express');
const { createCourseInfo, getAllCourseInfos, getCourseInfobyBatchId, updateCourseInfobyBatchId, deleteCourseInfobyBatchId} = require('../controllers/courseInfo.controller');
const router = express.Router()

router.route("/course-info").post(createCourseInfo);
router.route("/course-info").get(getAllCourseInfos);
router.route("/course-info/:batch_id").get(getCourseInfobyBatchId);
router.route("/course-info/:batch_id").put(updateCourseInfobyBatchId);
router.route("/course-info/:batch_id").delete(deleteCourseInfobyBatchId);

module.exports = router;