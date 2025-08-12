const mongoose = require('mongoose');

const careerShapingActivitySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    }, 
    title: {
        type: String,
        required: true
    },
    batchId: String
 })

module.exports = mongoose.model('CareerShapingActivity', careerShapingActivitySchema);