const express = require('express');
const { createUserInterest, getAllUserInterest, getUserInterest } = require('../controllers/userInterest.controller');
const router = express.Router()

router.route('/user-interest').post(createUserInterest)
router.route('/user-interest').get(getAllUserInterest)
router.route('/single-user-interest').get(getUserInterest)

module.exports = router;