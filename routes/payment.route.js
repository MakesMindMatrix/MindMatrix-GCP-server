const express = require('express');
const { createPayment, getPayment, getAllPayment, updatePayment, deletePayment, autoCreatePayment, paymentStatus } = require('../controllers/payment.controller');
const { isAuthenticated } = require('../middleware/auth');
const router = express.Router()

router.route("/payment").post(isAuthenticated, createPayment);
router.route("/get-payment").post(isAuthenticated, getPayment);
router.route("/all-payment").get(getAllPayment);
router.route("/payment").put(updatePayment);
router.route("/payment").delete(deletePayment);
// Routes for Phone payments gateway
router.route("/create-payment").post(isAuthenticated, autoCreatePayment)
router.route("/status/:id").post(paymentStatus)

module.exports = router