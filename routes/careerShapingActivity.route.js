const express = require('express');
const router = express.Router(); 
const { createCareerShapingActivity, getAllCareerShapingActivity, getCareerShapingActivity, updateCareerShapingActivity, deleteCareerShapingActivity } = require('../controllers/careerShapingActivity.controller');

router.route('/career-shaping-activity').post(createCareerShapingActivity)
router.route('/career-shaping-activity').get(getAllCareerShapingActivity);
router.route('/career-shaping-activity/:id').get(getCareerShapingActivity);
router.route('/career-shaping-activity/:id').put(updateCareerShapingActivity);
router.route('/career-shaping-activity/:id').delete(deleteCareerShapingActivity);  

module.exports = router;