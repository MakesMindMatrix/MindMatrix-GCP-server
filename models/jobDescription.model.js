const mongoose = require('mongoose')

const JDSchema = new mongoose.Schema({
    title: String,
    location: String,
    job_type: {
        type: String,
        enum: ['internships', 'job', 'both']
    },
    technical_skill: [String],//Add rating in this
    min_education_qualification: String,
    preferred_graduation_year: Number,
    communication_language: String,//Add enum
    isTaskRequired: Boolean,
    special_preference: String
})


const JobDescription = mongoose.model("JobDescription", JDSchema)
module.exports = JobDescription

// Title
// Location
// internships, jobs or both
// Technical skills
// Soft Skill prefance
// Minimum education Qualification
// Preferred graduation year
// Communication langauge
// isTaskRequired
// Diversity/cultural or special prefance




// Must have three technical skill