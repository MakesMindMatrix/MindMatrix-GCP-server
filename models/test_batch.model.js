const mongoose = require('mongoose')

const testBatchSchema = new mongoose.Schema({
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
    }
},{
    timestamps: true
})

const TestBatch = mongoose.model("TestBatch", testBatchSchema)
module.exports = TestBatch