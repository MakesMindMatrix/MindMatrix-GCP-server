const express = require('express')
const { courses_Interlib } = require('../controllers/course.controller')
const { isAuthenticated } = require('../middleware/auth')
const router = express.Router()

router.route("/my-course/:email").get(isAuthenticated, courses_Interlib)

module.exports = router

// GAIBME2401
// GAIEC240201