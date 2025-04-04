const asyncHandler = require('../middleware/asyncHandler')
const Payment = require('../models/payment.model')
const crypto = require('crypto');
const axios = require('axios');
// import { StandardCheckoutClient, Env } from 'pg-sdk-node';
const StandardCheckoutClient = require('pg-sdk-node')
const StandardCheckoutPayRequest = require('pg-sdk-node')
const Env = require('pg-sdk-node')
const { v4: uuidv4 } = require('uuid');

// Testing data
const clientId = "<clientId>";
const clientSecret = "<clientSecret>";
const clientVersion = 1;  //insert your client version here
const env = Env.P;

const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076"
const MERCHANT_ID = "PGTESTPAYUAT86"

const MERCHANT_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
const MERCHANT_STATUS_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

const redirectUrl = "https://makes.mindmatrix.io/api/v1/status"

const successUrl = "https://makes.mindmatrix.io/payment-success"
const failureUrl = "https://makes.mindmatrix.io/payment-failure"

exports.createPayment = asyncHandler(async (req, res, next) => {
    const { courseName, coursePrice, batchId, transactionId } = req.body
    const userId = req.user.id

    const paymentData = await Payment.create({
        courseName,
        coursePrice,
        batchId,
        transactionId,
        user: userId
    })

    res.status(200).json({
        success: true,
        message: "Payment Data created successfully",
        PaymentData: paymentData
    })

})

exports.getPayment = asyncHandler(async (req, res, next) => {
    const { batchId } = req.body

    const userId = req.user.id
    const singleCourseData = await Payment.find({ user: userId, batchId }).populate("user")

    res.status(200).json({
        success: true,
        message: "Single course data fetched successfully",
        CourseData: singleCourseData
    })
})

exports.getAllPayment = asyncHandler(async (req, res, next) => {
    const allPaymentData = await Payment.find({
        // createdAt: {
        //     $gte: new Date(2025, 1, 23),
        //     $lt: new Date(2025, 1, 24),
        //   }
    }).populate("user")

    // console.log({createdAt: {
    //         $gte: new Date(2025, 1, 23).toUTCString(),
    //         $lt: new Date(2025, 1, 24).toUTCString(),
    //       }})
    res.status(200).json({
        success: true,
        message: "All available coursedat fetched successfully",
        total: allPaymentData.length,
        Payment: allPaymentData
    })
})

exports.updatePayment = asyncHandler(async (req, res, next) => {

})

exports.deletePayment = asyncHandler(async (req, res, next) => {
    const deletedPaymentData = await Payment.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Payment Data deleted successfully",
        deletedPaymentData
    })
})

// Controller for phone pe payment gateway
exports.autoCreatePayment = asyncHandler(async (req, res, next) => {
    const { courseName, coursePrice, batchId } = req.body
    console.log(courseName, coursePrice, batchId)
    const url = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

    const params = new URLSearchParams();
    params.append("client_id", 'SU2503231347450136164095');
    params.append("client_version", "1");
    params.append("client_secret", '9bb3ff9e-a677-4d48-8970-dc147d0950e4');
    params.append("grant_type", "client_credentials");

    const tokenResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    const token = await tokenResponse.json();
    const merchantOrderId = crypto.randomBytes(16).toString('hex')

    const apiResponse = await fetch(`https://api.phonepe.com/apis/pg/checkout/v2/pay`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token.access_token}`
        },
        body: JSON.stringify({
            merchantOrderId,
            "amount": coursePrice * 100,
            "expireAfter": 1200,
            "metaInfo": {
                "udf1": courseName,
                "udf2": coursePrice,
                "udf3": batchId,
                "udf4": req.user.id
            },
            "paymentFlow": {
                "type": "PG_CHECKOUT",
                "message": "Payment message used for collect requests",
                "merchantUrls": {
                    "redirectUrl": `https://makes.mindmatrix.io/api/v1/status/${merchantOrderId}`
                },
                "paymentModeConfig": {
                    "enabledPaymentModes": [
                        {
                            "type": "UPI_INTENT"
                        },
                        {
                            "type": "UPI_COLLECT"
                        },
                        {
                            "type": "UPI_QR"
                        },
                        {
                            "type": "NET_BANKING"
                        },
                        {
                            "type": "CARD",
                            "cardTypes": [
                                "DEBIT_CARD",
                                "CREDIT_CARD"
                            ]
                        }
                    ],
                }
            }
        })
    })
    const response = await apiResponse.json()
    console.log(response)
    res.status(200).json({
        success: true,
        message: "Payment Data for course successfully",
        response,
        merchantOrderId
    })
})

// COntroller for payment gateway status
exports.paymentStatus = asyncHandler(async (req, res, next) => {
    const params = new URLSearchParams();
    params.append("client_id", 'SU2503231347450136164095');
    params.append("client_version", "1");
    params.append("client_secret", '9bb3ff9e-a677-4d48-8970-dc147d0950e4');
    params.append("grant_type", "client_credentials");

    const Id = req.params.id;

    const url = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";

    const tokenResponse = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
    });

    const token = await tokenResponse.json();

    const apiResponse = await fetch(`https://api.phonepe.com/apis/pg/checkout/v2/order/${Id}/status
`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `O-Bearer ${token.access_token}`
        }
    })
    const response = await apiResponse.json()

    if (response.state === 'COMPLETED') {
        const payment = await Payment.create({
            courseName: response.metaInfo.udf1,
            coursePrice: response.metaInfo.udf2,
            batchId: response.metaInfo.udf3,
            user: response.metaInfo.udf4,
            transactionId: response.paymentDetails[0].transactionId,
            paymentMode: response.paymentDetails[0].paymentMode,
            maskedAccountNumber: response.paymentDetails[0].instrument.maskedAccountNumber,
            ifsc: response.paymentDetails[0].instrument.ifsc,
            accountType: response.paymentDetails[0].instrument.accountType,
            paymentType: response.paymentDetails[0].rail.type,
        })

        res.status(200).json({
            success: true,
            message: "Payment Data deleted successfully",
            payment
        })
    }
})
