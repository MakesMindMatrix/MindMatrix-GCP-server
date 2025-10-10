const HackathonRegistration = require('../models/hackathonRegistration.model');

// Create a new registration
exports.createRegistration = async (req, res) => {
    try {
        const registration = new HackathonRegistration(req.body);
        await registration.save();
        res.status(201).json({ 
            success: true,
            message: "Team Registered successfully", 
            data: registration 
        });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// Get all registrations
exports.getAllRegistrations = async (req, res) => {
    try {
        const registrations = await HackathonRegistration.find();
        res.status(200).json({ 
            success: true,
            message: "All Registrations fetched succesfully", 
            data: registrations 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// Get a single registration by ID
exports.getRegistrationById = async (req, res) => {
    try {
        const registration = await HackathonRegistration.findById(req.params.id);
        if (!registration) {
            return res.status(404).json({ 
                success: false,
                error: 'Registration not found' });
        }
        res.status(200).json({ 
            success: true, 
            message: "Single Registration fetched successfully", 
            data: registration 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// Update registration by ID
exports.updateRegistrationById = async (req, res) => {
    try {
        const registration = await HackathonRegistration.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!registration) {
            return res.status(404).json({ 
                success: false, 
                error: 'Registration not found' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message : "Registration updated successfully",
            data: registration });
    } catch (error) {
        res.status(400).json({ 
            success: false, 
            error: error.message 
        });
    }
};

// Delete registration by ID
exports.deleteRegistrationById = async (req, res) => {
    try {
        const registration = await HackathonRegistration.findByIdAndDelete(req.params.id);
        if (!registration) {
            return res.status(404).json({ 
                success: false, 
                error: 'Registration not found' 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: 'Registration deleted successfully' });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message });
    }
};

// Check if a participant is registered by email
exports.checkIfRegistered = async (req, res) => {
    try {
        const { email } = req.query;
        if (!email) {
            return res.status(400).json({ success: false, error: 'Email is required' });
        }

        const registration = await HackathonRegistration.findOne({ participants_emails: email });
        if (registration) {
            return res.status(200).json({ 
                success: true, 
                registered: true,
                message: "Participant is Registered already", 
                data: registration 
            });
        }
        res.status(200).json({ 
            success: true, 
            message: "Participant is Not Registered already",
            registered: false 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message });
    }
};
