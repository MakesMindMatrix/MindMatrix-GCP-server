const express = require('express')
const router = express.Router()
const { createCollege, readCollege, readCollegeByUniversityId } = require('../controllers/college.controller')

// app.post("/updateUniversity", updateUniversity)
// app.post("/deleteUniversity", deleteUniversity)

router.route("/createCollege").post(createCollege);
router.route("/getCollegeByUniversity/:id").get(readCollegeByUniversityId);
router.route("/getCollege").get(readCollege);

module.exports = router;