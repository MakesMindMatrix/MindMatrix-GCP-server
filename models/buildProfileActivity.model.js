const mongoose = require('mongoose');

const buildProfileActivitySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    batch_id: String,
}, {
    timestamps: true})

module.exports = mongoose.model('BuildProfileActivity', buildProfileActivitySchema);