const asyncHandler = require("../middleware/asyncHandler");
const CollegeSubscription = require("../models/collegeSubscription.model");


// Create document for company DNA
exports.createCollegeSubscription = asyncHandler(async (req, res) => {
    const {name, countOfUser, offerings, price, discount} = req.body

    const collegeSubscription = await CollegeSubscription.create({
        name,
        countOfUser,
        offerings,
        price,
        discount
    })
    res.status(200).json({
        success: true,
        message: "College subscription created successfully",
        collegeSubscription
    })
})

// Read all document for company DNA
exports.getAllCollegeSubscriptionModel = asyncHandler(async (req, res) => {
    const collegeSubscription = await CollegeSubscription.find()

    res.status(200).json({
        success: true,
        message: "All College Subscription fetched successfully",
        collegeSubscription
    })
})

// Read one document for company DNA
exports.getCollegeSubscriptionModel = asyncHandler(async (req, res) => {
    const collegeSubscription = await CollegeSubscription.find()

    res.status(200).json({
        success: true,
        message: "Single college subscription fetched successfully",
        collegeSubscription
    })
})

// Update document for company DNA
exports.updateCollegeSubscriptionModel = asyncHandler(async (req, res) => {
    const collegeSubscription = await collegeSubscriptionModel.findByIdAndUpdate({ id })

    res.status(200).json({
        success: true,
        message: "college subscription updated successfully",
        collegeSubscription
    })
})

// Delete document for company DNA
exports.deleteCollegeSubscriptionModel = asyncHandler(async (req, res) => {
    const { id } = req.params

    const CollegeSubscriptionModel = await collegeSubscriptionModel.findByIdAndDelete({ id })

    res.status(200).json({
        success: true,
        message: "All college subscription deleted successfully",
        CollegeSubscriptionModel
    })
})