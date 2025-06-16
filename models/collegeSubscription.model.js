const mongoose = require('mongoose')

const collegeSubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Subscription type should be entered must"],
        trim: true
    },
    countOfUser: Number,
    offerings: [
        {
            name: String,
            available: Boolean
        }
    ],
    price: Number,
    discountPercentage: Number
},
{
    timestamps: true
})

module.exports = mongoose.model("College-Subscription", collegeSubscriptionSchema);