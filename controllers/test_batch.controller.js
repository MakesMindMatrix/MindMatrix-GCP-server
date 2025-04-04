const TestBatch = require("../models/test_batch.model")
const ErrorHandler = require('../utils/errorHandler')
const asyncHandler = require('../middleware/asyncHandler')

// Add TestBatch 
exports.createTestBatch = asyncHandler(async (req, res, next) => {
    const { branch, semester, batch_id, course_name } = req.body;

    const batch = await TestBatch.create({
        branch,
        semester,
        batch_id,
        course_name
    })

    res.status(201).json({
        success: true,
        message: "TestBatch registered succesfully",
        batch,
    });

})

// Get batch 
exports.getTestBatch = asyncHandler(async (_req, res, next) => {
    const batch = await TestBatch.find().populate("branch")

    res.status(200).json({
        success: true,
        message: "TestBatch fetched successfully",
        Batch_count: batch.length,
        batch
    })
})

// Update batch
exports.updateTestBatch = asyncHandler(async (req, res, next) => {
    const {branch, semester, batch_id, course_name} = req.body;

    let batch = await TestBatch.findOne({ batch_id })

    res.status(201).json({
        success: true,
        message: "TestBatch updated succesfully",
        batch,
      });
})