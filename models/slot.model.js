const mongoose = require('mongoose')

const slotSchema = new mongoose.Schema({
    startTiming: {
        type: Date
    },
    endTiming: {
        type: Date
    },
    attendees: {
        type: Number
    },
    enrolledAttendees: {
        type: Number,
        default: 0
    },
    joinLink: {
        type: String
    },
    Colleges: [
        {
            college: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "College",
            },
            noOfAttendees: {
                type: Number
            },
            Remarks: {
                type: String
            }
        }
    ]
}, {
    timestamps: true
})

const Slot = mongoose.model("Slot", slotSchema)
module.exports = Slot;