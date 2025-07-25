const mongoose = require('mongoose');

const mentorActivitySchema = new mongoose.Schema({
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor',
        required: true
    },
    sessionTitle: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    },
    batchId: String,
}, {
    timestamps: true
});

module.exports = mongoose.model('MentorActivity', mentorActivitySchema);