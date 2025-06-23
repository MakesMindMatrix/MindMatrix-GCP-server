const express = require('express')
const router = express.Router()
const { createCollege, readCollege, readCollegeByUniversityId, getCollegesWithStudents, deleteCollege } = require('../controllers/college.controller')

router.route("/createCollege").post(createCollege);
router.route("/getCollegeByUniversity/:id").get(readCollegeByUniversityId);
router.route("/getCollege").get(readCollege);
router.route("/deleteCollege").get(deleteCollege);
router.route("/getCollege-byStudents").get(getCollegesWithStudents);

module.exports = router;