const express = require('express')
const { createTestBatch, getTestBatch } = require('../controllers/test_batch.controller')
const router = express.Router()

router.route("/createTestBatch").post(createTestBatch)
router.route("/getTestBatch").get(getTestBatch)

module.exports = router