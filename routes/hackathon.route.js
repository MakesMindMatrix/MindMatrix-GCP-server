const express = require('express');
const { createRegistration, getAllRegistrations, getRegistrationById, updateRegistrationById, deleteRegistrationById, checkIfRegistered } = require('../controllers/hackathon.controller');
const router = express.Router()

// Register a new team
router.route("/hackathon/register").post(createRegistration);
// Get all registrations
router.route("/hackathon/registrations").get(getAllRegistrations);
// Get a specific registration by ID
router.route("/hackathon/registrations/:id").get(getRegistrationById);
// Update a registration by ID
router.route("/hackathon/registrations/:id").put(updateRegistrationById);
// Delete a registration by ID
router.route("/hackathon/registrations/:id").delete(deleteRegistrationById);
// Check if a user is registered (by email) "?email=example@gmail.com"
router.route("/hackathon/check").get(checkIfRegistered);
module.exports = router;