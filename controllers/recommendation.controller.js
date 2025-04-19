const Recommendation = require("../models/recommendation.model")
const ErrorHandler = require('../utils/errorHandler')
const asyncHandler = require('../middleware/asyncHandler')

// Add TestBatch 
exports.createTestBatch = asyncHandler(async (req, res, next) => {
    const { branch, semester, batch_id, course_name, course_image } = req.body;

    const batch = await Recommendation.create({
        branch,
        semester,
        batch_id,
        course_name,
        course_image
    })

    res.status(201).json({
        success: true,
        message: "Recommendation registered succesfully",
        batch,
    });

})

// Get batch 
exports.getTestBatch = asyncHandler(async (_req, res, next) => {
    const batch = await Recommendation.find().populate("branch")

    res.status(200).json({
        success: true,
        message: "Recommendation fetched successfully",
        Batch_count: batch.length,
        batch
    })
})

// Update batch
exports.updateTestBatch = asyncHandler(async (req, res, next) => {
    const {branch, semester, batch_id, course_name} = req.body;

    let batch = await Recommendation.findOne({ batch_id })

    res.status(201).json({
        success: true,
        message: "Recommendation updated succesfully",
        batch,
      });
})