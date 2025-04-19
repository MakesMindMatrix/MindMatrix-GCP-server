const mongoose = require('mongoose')

const recommendationSchema = new mongoose.Schema({
    branch: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Branch"
        }
    ],
    semester: [Number],
    batch_id: {
        type: String
    },
    course_name:{
        type: String
    },
    course_image: {
        type: String
    }
},{
    timestamps: true
})

const Recommendation = mongoose.model("Recommendation", recommendationSchema)
module.exports = Recommendation