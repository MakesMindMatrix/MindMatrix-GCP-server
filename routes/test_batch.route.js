const express = require('express')
const { createTestBatch, getTestBatch } = require('../controllers/test_batch.controller')
const { getTest } = require('../controllers/batch.controller')
const router = express.Router()

router.route("/createTestBatch").post(createTestBatch)
router.route("/getTestBatch").get(getTestBatch)
router.route("/getTest").get(getTest)

module.exports = router