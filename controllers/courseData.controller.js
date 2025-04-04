

const asyncHandler = require('../middleware/asyncHandler')
const CourseData = require('../models/courseData.model')

// Controller for create new Course
exports.createCourseData = asyncHandler(async (req, res, next) => {
    const { name, image, batch_id, hero, about, instructor, curriculum } = req.body

    // console.log(name, image, batch_id, hero, about, instructor, curriculum)
    const courseData = await CourseData.create({
        name,
        image,
        batch_id,
        hero,
        about,
        instructor,
        curriculum
    })

    res.status(200).json({
        success: true,
        message: "Course Data created successfully",
        CourseData: courseData
    })
})
// Controller for read all Course data
exports.readAllCourseData = asyncHandler(async (req, res, next) => {

    const allCourseData = await CourseData.find()

    res.status(200).json({
        success: true,
        message: "All available coursedat fetched successfully",
        CourseData: allCourseData
    })
})

// Controller for read one course data based on batch id
exports.readCourseData = asyncHandler(async (req, res, next) => {
    const singleCourseData = await CourseData.findById(req.params.id)

    res.status(200).json({
        success: true,
        message: "Single course data fetched successfully",
        CourseData: singleCourseData
    })
})

// Controller for update Course data
exports.updateCourseData = asyncHandler(async (req, res, next) => {
    const updatedCourseData = await CourseData.findByIdAndUpdate(req.params.id, data)

    res.status(200).json({
        success: true,
        message: "Course Data updated succesfully",
        UpdatedCourseData: updatedCourseData
    })
})

// Controller for delete Course data
exports.deleteCourseData = asyncHandler(async (req, res, next) => {
    const deletedCourseData = await CourseData.findByIdAndDelete(req.params.id)

    res.status(200).json({
        success: true,
        message: "Course Data deleted successfully",
        deletedCourseData
    })
})