const express = require('express');
const router = express.Router();
const { createBuildProfileActivity, getAllBuildProfileActivity, getBuildProfileActivity, updateBuildProfileActivity, deleteBuildProfileActivity } = require('../controllers/buildProfileActivity.controller');

router.route('/build-profile-activity').post(createBuildProfileActivity)
router.route('/build-profile-activity').get(getAllBuildProfileActivity);
router.route('/build-profile-activity/:id').get(getBuildProfileActivity);
router.route('/build-profile-activity/:id').put(updateBuildProfileActivity);
router.route('/build-profile-activity/:id').delete(deleteBuildProfileActivity);

module.exports = router;