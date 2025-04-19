const express = require('express')
const { createTestBatch, getTestBatch } = require('../controllers/recommendation.controller')
const { getTest } = require('../controllers/batch.controller')
const router = express.Router()

router.route("/createRecommendation").post(createTestBatch)
router.route("/getRecommendation").get(getTestBatch)
router.route("/getTest").get(getTest)

module.exports = router