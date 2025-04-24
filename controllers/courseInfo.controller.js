

const asyncHandler = require('../middleware/asyncHandler')
const CourseInfo = require('../models/courseInfo.model')

// Controller for create new Course
exports.createCourseInfo = asyncHandler(async (req, res, next) => {
    try {
        const courseInfo = new CourseInfo(req.body);
        const savedCourseInfo = await courseInfo.save();

        res.status(201).json({
            success: true,
            message: "Course Info created successfully",
            CourseInfo: savedCourseInfo});

    } catch (err) {
        
        res.status(400).json({
            success: false, 
            error: err.message });
    }
})
// Controller for read all Course Info
exports.getAllCourseInfos = asyncHandler(async (req, res, next) => {

    try {
        const courses = await CourseInfo.find()
            .populate('course_university')
            .populate('course_college')
            .populate('course_branch');
        res.status(200).json({
            success: true,
            message: "All Course Info fetched successfully",
            CourseInfo: courses});

    } catch (err) {
        
        res.status(500).json({ 
            success: false,
            error: err.message });
    }
})

// Controller for read one course data based on batch id
exports.getCourseInfobyBatchId = asyncHandler(async (req, res, next) => {

    try {
        const course = await CourseInfo.findOne({ batch_id: req.params.batch_id })
            .populate('course_university')
            .populate('course_college');
        if (!course) {
            return res.status(404).json({ 
                success: false,
                error: 'CourseInfo not found' });
        }

        res.status(200).json({
            success: true, 
            message: "Single course data fetched successfully", 
            CourseInfo: course});

    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message });
    }
})

// Controller for update Course data
exports.updateCourseInfobyBatchId = asyncHandler(async (req, res, next) => {
    try {
        const updatedCourse = await CourseInfo.findOneAndUpdate(
            { batch_id: req.params.batch_id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedCourse) {
            return res.status(404).json({ 
                success: false,
                error: 'CourseInfo not found' });
        }
        res.status(200).json({ 
            success: true, 
            message: "Course Info updated successfully", 
            CourseInfo: updatedCourse});
    } catch (err) {
        res.status(400).json({ 
            success: false,
            error: err.message });
    }
})

// Controller for delete Course data
exports.deleteCourseInfobyBatchId = asyncHandler(async (req, res, next) => {
    try {
        const deletedCourse = await CourseInfo.findOneAndDelete({ batch_id: req.params.batch_id });
        if (!deletedCourse) {
            return res.status(404).json({ 
                success: false,
                error: 'CourseInfo not found' });
        }
        res.status(200).json({ 
            success: true,
            message: 'CourseInfo deleted successfully' });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message });
    }
})