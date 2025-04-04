const mongoose = require('mongoose')

const batchSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    semester: Number,
    batch_id: {
        type: String
    },
    course_name: {
        type: String
    }
},{
    timestamps: true
})

const Batch = mongoose.model("Batch", batchSchema)
module.exports = Batch