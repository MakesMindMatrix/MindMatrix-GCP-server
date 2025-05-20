const asyncHandler = require('../middleware/asyncHandler')
const CompanyDNA = require('../models/companyDna.model')

// Create document for company DNA
exports.createCompanyDna = asyncHandler(async (req, res) => {
    const companyDna = await CompanyDNA.find()

    res.status(200).json({
        success: true,
        message: "Company DNA created successfully",
        companyDna
    })
})

// Read all document for company DNA
exports.getAllCompanyDna = asyncHandler(async (req, res) => {
    const companyDna = await CompanyDNA.find()

    res.status(200).json({
        success: true,
        message: "All company DNA fetched successfully",
        companyDna
    })
})

// Read one document for company DNA
exports.getCompanyDna = asyncHandler(async (req, res) => {
    const companyDna = await CompanyDNA.find()

    res.status(200).json({
        success: true,
        message: "Single company DNA fetched successfully",
        companyDna
    })
})

// Update document for company DNA
exports.updateCompanyDna = asyncHandler(async (req, res) => {
    const companyDna = await CompanyDNA.findByIdAndUpdate({ id })

    res.status(200).json({
        success: true,
        message: "company DNA updated successfully",
        companyDna
    })
})

// Delete document for company DNA
exports.deleteCompanyDna = asyncHandler(async (req, res) => {
    const { id } = req.params

    const companyDna = await CompanyDNA.findByIdAndDelete({ id })

    res.status(200).json({
        success: true,
        message: "All company DNA deleted successfully",
        companyDna
    })
})
