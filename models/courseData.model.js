// Course name, course image, batch id

// Hero section - Course name, background image, description, free or price

// About section - About, 5points desc

// Course instructor - Instructor image, Designation, name, description

// Course curriculum - Module details, course image

const mongoose = require('mongoose')

const courseDataSchema = new mongoose.Schema(
    {
        name: String,
        image: String,
        batch_id: String,
        hero: Object,
        about: Object,
        instructor:Object,
        curriculum: Object
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("CourseData", courseDataSchema)