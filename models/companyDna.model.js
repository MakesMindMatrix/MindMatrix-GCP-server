const mongoose = require('mongoose')

const companyDna = new mongoose.Schema({
    name: {
        type: String
    },
    role: [
        {
            role_name: String,
            required_skill: [String],
            tools_used: [String],
            experience: String
        }
    ],
    culture_traits: String,
    technical_skills: [String],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const CompanyDNA = mongoose.model("CompanyDNA", companyDna)
module.exports = CompanyDNA