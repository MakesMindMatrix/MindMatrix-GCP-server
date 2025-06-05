const asyncHandler = require("../middleware/asyncHandler");
const UserInterest = require("../models/userInterest.model");

// Controller for create user interest
exports.createUserInterest = asyncHandler(async (req, res, next) => {
    const { name, email, phone, state, university, college, branch, specialization, admissionYear, isStudent } = req.body

    const userInterest = await UserInterest.create({
        name,
        email,
        phone,
        state,
        university,
        college,
        branch,
        specialization,
        admissionYear,
        isStudent
    })

    res.status(201).json({
        success: true,
        message: "User interest created successfully",
        userInterest
    })
})

// Controller for get single user interest
exports.getUserInterest = asyncHandler(async (req, res, next) => {

    res.status(200).json({
        success: true,
        message: "Batch fetched successfully",
        Batch_count: userInterest.length,
        userInterest
    })
})

// Controller for get all user interest
exports.getAllUserInterest = asyncHandler(async (req, res, next) => {
    const userInterest = await UserInterest.find().populate("university").populate("college").populate("branch")
    console.log("Called")
    res.status(200).json({
        success: true,
        message: "User interest fetched successfully",
        User_interest_count: userInterest.length,
        userInterest
    })
})

// Controller for update user interest
exports.updateUserInterest = asyncHandler(async (req, res, next) => {

    // res.status(200).json({
    //     success: true,
    //     message: "Batch fetched successfully",
    //     Batch_count: userInterest.length,
    //     userInterest
    // })
})

// Controller for delete user interest
exports.deleteUserInterest = asyncHandler(async (req, res, next) => {

    // res.status(200).json({
    //     success: true,
    //     message: "Batch fetched successfully",
    //     Batch_count: userInterest.length,
    //     userInterest
    // })
})