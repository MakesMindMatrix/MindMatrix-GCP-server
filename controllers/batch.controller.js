const Batch = require("../models/batch.model")
const ErrorHandler = require('../utils/errorHandler')
const asyncHandler = require('../middleware/asyncHandler')

// Add Batch 
exports.createBatch = asyncHandler(async (req, res, next) => {
    const { branch, semester, batch_id } = req.body;

    const batch = await Batch.create({
        branch,
        semester,
        batch_id
    })
    console.log(batch)
    res.status(201).json({
        success: true,
        message: "Batch registered succesfully",
        batch,
    });

})

// Get batch 
exports.getBatch = asyncHandler(async (_req, res, next) => {
    const batch = await Batch.find().populate("branch")

    res.status(200).json({
        success: true,
        message: "Batch fetched successfully",
        Batch_count: batch.length,
        batch
    })
})

// Update batch
exports.updateBatch = asyncHandler(async (req, res, next) => {
    const {branch, semester, batch_id, course_name} = req.body;

    // let batch = await Batch.find({ batch_id })
    const updatedBatch = await Batch.updateMany({batch_id}, { $set: { course_name } })
    console.log(batch)
    res.status(201).json({
        success: true,
        message: "Batch updated succesfully",
        length: updatedBatch.length,
        updatedBatch,
      });
})

exports.getTest = asyncHandler(async (_req, res,next) => {
    const test = 'Staging tested successfully -1'

    res.status(201).json({
        success: true,
        message: "Batch fetched succesfully",
        test
      });
})