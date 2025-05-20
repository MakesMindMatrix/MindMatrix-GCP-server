const asyncHandler = require('../middleware/asyncHandler')
const JobDescription = require('../models/jobDescription.model')

// Create document for Job Description
exports.createJobDescriptipon = asyncHandler(async (req, res) => {
    const { } = req.body

    res.status(201).json({
        success: true,
        message: "Job description created successfully",
        jobDescription
    })
})

// Read all document for Job Description
exports.getAllJobDescriptipon = asyncHandler(async (req, res) => {
    const jobDescription = await JobDescription.find()

    res.status(200).json({
        success: true,
        message: "All Job description fetched successfully",
        jobDescription
    })
})

// Read one document for Job Description
exports.getJobDescriptipon = asyncHandler(async (req, res) => {
    const { id } = req.params

    const singleJobDescription = await JobDescription.find({ id })

    res.status(200).json({
        success: true,
        message: "Single Job description fetched successfully",
        singleJobDescription
    })
})

// Update document for Job Description
exports.updateJobDescriptipon = asyncHandler(async (req, res) => {
    const { id } = req.params

    const singleJobDescription = await JobDescription.findByIdAndUpdate()

    res.status(200).json({
        success: true,
        message: "Job description updated successfully",
        singleJobDescription
    })
})

// Delete document for Job Description
exports.deleteJobDescriptipon = asyncHandler(async (req, res) => {
    const { id } = req.params

    const singleJobDescription = await JobDescription.findByIdAndDelete({ id })

    res.status(200).json({
        success: true,
        message: "Single Job description deleted successfully",
        singleJobDescription
    })
})
