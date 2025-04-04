const express = require('express');
const { createSlot, getSlot, updateSlot, getAllSlot } = require('../controllers/slot.controller');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const router = express.Router()

router.route("/slot").post(createSlot)
router.route("/slot").get(isAuthenticated,getSlot)
router.route("/slot").put(isAuthenticated, updateSlot)

// Admin
router.route("/all-slot").get(isAuthenticated, authorizeRoles("Admin") ,getAllSlot)

module.exports = router;