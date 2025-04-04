const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
    {
        courseName: String,
        coursePrice: Number,
        batchId: String,
        transactionId: String,
        paymentMode: String,
        maskedAccountNumber: String,
        ifsc: String,
        accountType: String,
        paymentType: String,
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    },
    {
        timestamps: true
    }
)

const Payment = mongoose.model("Payment", paymentSchema)
module.exports = Payment;

// Course name 
// Course price
// Batch id
// "transactionId": 
// "paymentMode": 
// "maskedAccountNumber": 
// "ifsc": 
// "accountType": 
// "type": 