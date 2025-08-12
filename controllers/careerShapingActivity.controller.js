const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const CareerShapingActivity = require('../models/careerShapingActivity.model');

// Create a new carrer shaping activity
exports.createCareerShapingActivity = asyncHandler(async (req, res, next) => {
    const { image, title, batchId } = req.body;

    if (!image || !title) {
        return next(new ErrorHandler('Image and title are required', 400));
    }

    const newActivity = await CareerShapingActivity.create({
        image,
        title,
        batchId
    });

    res.status(201).json({
        success: true,
        data: newActivity
    });
})

// Get all career shaping activity
exports.getAllCareerShapingActivity = asyncHandler(async (req, res, next) => {
    const activities = await CareerShapingActivity.find();

    res.status(200).json({
        success: true,
        data: activities
    });
})

// Get single career shaping activity
exports.getCareerShapingActivity = asyncHandler(async (req, res, next) => {
    const activity = await CareerShapingActivity.findById(req.params.id);

    if (!activity) {
        return next(new ErrorHandler('Career shaping activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: activity
    });
})

// Update career shaping activity
exports.updateCareerShapingActivity = asyncHandler(async (req, res, next) => {
    const { image, title, batchId } = req.body;

    if (!image || !title) {
        return next(new ErrorHandler('Image and title are required', 400));
    }

    const updatedActivity = await CareerShapingActivity.findByIdAndUpdate(
        req.params.id,
        { image, title, batchId },
        { new: true, runValidators: true }
    );

    if (!updatedActivity) {
        return next(new ErrorHandler('Career shaping activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: updatedActivity
    });
})

// Delete single career shaping activity
exports.deleteCareerShapingActivity = asyncHandler(async (req, res, next) => {
    const activity = await CareerShapingActivity.findByIdAndDelete(req.params.id);

    if (!activity) {
        return next(new ErrorHandler('Career shaping activity not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Career shaping activity deleted successfully'
    });
})

// exports.createActivity = async (req, res) => {
//     try {
//         const activity = new CareerShapingActivity(req.body);
//         await activity.save();
//         res.status(201).json(activity);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // Get all activities
// exports.getAllActivities = async (req, res) => {
//     try {
//         const activities = await CareerShapingActivity.find();
//         res.json(activities);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Get activity by ID
// exports.getActivityById = async (req, res) => {
//     try {
//         const activity = await CareerShapingActivity.findById(req.params.id);
//         if (!activity) return res.status(404).json({ error: 'Activity not found' });
//         res.json(activity);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Update activity by ID
// exports.updateActivity = async (req, res) => {
//     try {
//         const activity = await CareerShapingActivity.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!activity) return res.status(404).json({ error: 'Activity not found' });
//         res.json(activity);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // Delete activity by ID
// exports.deleteActivity = async (req, res) => {
//     try {
//         const activity = await CareerShapingActivity.findByIdAndDelete(req.params.id);
//         if (!activity) return res.status(404).json({ error: 'Activity not found' });
//         res.json({ message: 'Activity deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };