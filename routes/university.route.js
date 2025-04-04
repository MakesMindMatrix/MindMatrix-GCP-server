const express = require('express')
const router = express.Router()
const { createUniversity, readUniversity, updateUniversity, deleteUniversity } = require('../controllers/university.controller')

router.route("/createUniversity").post(createUniversity);
router.route("/getUniversity").get(readUniversity);
router.route("/updateUniversity").post(updateUniversity);
router.route("/updateUniversity").post(updateUniversity);

module.exports = router;