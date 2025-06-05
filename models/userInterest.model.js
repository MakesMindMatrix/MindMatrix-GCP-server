const mongoose = require('mongoose')

const userInterestSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: Number,
    state: String,
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "University"
    },
    college: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "College"
    },
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    specialization: String,
    admissionYear: String,
    isStudent: Boolean
})

module.exports = mongoose.model("UserInterest", userInterestSchema)

// name
// email
// phone
// state
// University
// College
// Which Specialisation you belong to ? (dropdown- B.Tech, B.A., B.Com. BCA, M.Tech . M.A.)
// Which Branch you belong to ? ( Dropdown -  Mechanical , Civil , Computer Science, )
// Your College Admission Year ?