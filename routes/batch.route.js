const express = require('express')
const { createBatch, getBatch, updateBatch } = require('../controllers/batch.controller')
const router = express.Router()

router.route("/createBatch").post(createBatch)
router.route("/getBatch").get(getBatch)
router.route("/updateBatch").put(updateBatch)

module.exports = router