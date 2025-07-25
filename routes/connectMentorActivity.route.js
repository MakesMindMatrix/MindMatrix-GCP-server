const express = require('express');
const router = express.Router();

const { createMentorActivity, getAllMentorActivity, getMentorActivity, updateMentorActivity, deleteMentorActivity } = require('../controllers/connectMentorActivity.controller');

router.route('/mentor-activity').post(createMentorActivity)
router.route('/mentor-activity').get(getAllMentorActivity);
router.route('/mentor-activity/:id').get(getMentorActivity);
router.route('/mentor-activity/:id').put(updateMentorActivity);
router.route('/mentor-activity/:id').delete(deleteMentorActivity);

module.exports = router;