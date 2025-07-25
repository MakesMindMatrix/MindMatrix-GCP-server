const MentorActivity = require('../models/mentorActivity.model');
const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');

// Create a new mentor activity
exports.createMentorActivity = asyncHandler(async (req, res, next) => {
    const { image, title, batchId } = req.body;

    if (!image || !title) {
        return next(new ErrorHandler('Image and title are required', 400));
    }

    const newActivity = await MentorActivity.create({
        image,
        title,
        batchId
    });

    res.status(201).json({
        success: true,
        data: newActivity
    });
});

// Get all mentor activity
exports.getAllMentorActivity = asyncHandler(async (req, res, next) => {
    const activities = await MentorActivity.find();

    res.status(200).json({
        success: true,
        data: activities
    });
});

// Get single mentor activity
exports.getMentorActivity = asyncHandler(async (req, res, next) => {
    const activity = await MentorActivity.findById(req.params.id);

    if (!activity) {
        return next(new ErrorHandler('Mentor activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: activity
    });
});

// Update single mentor activity
exports.updateMentorActivity = asyncHandler(async (req, res, next) => {
    const { image, title, batchId } = req.body;

    if (!image || !title) {
        return next(new ErrorHandler('Image and title are required', 400));
    }

    const updatedActivity = await MentorActivity.findByIdAndUpdate(
        req.params.id,
        { image, title, batchId },
        { new: true, runValidators: true }
    );

    if (!updatedActivity) {
        return next(new ErrorHandler('Mentor activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: updatedActivity
    });
});

// Delete single mentor activity
exports.deleteMentorActivity = asyncHandler(async (req, res, next) => {
    const activity = await MentorActivity.findByIdAndDelete(req.params.id);

    if (!activity) {
        return next(new ErrorHandler('Mentor activity not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Mentor activity deleted successfully'
    });
});

// exports.createMentorActivity = async (req, res) => {
//     try {
//         const activity = new MentorActivity(req.body);
//         await activity.save();
//         res.status(201).json(activity);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // Get all mentor activities
// exports.getMentorActivities = async (req, res) => {
//     try {
//         const activities = await MentorActivity.find();
//         res.json(activities);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Get a single mentor activity by ID
// exports.getMentorActivityById = async (req, res) => {
//     try {
//         const activity = await MentorActivity.findById(req.params.id);
//         if (!activity) {
//             return res.status(404).json({ error: 'Mentor activity not found' });
//         }
//         res.json(activity);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };

// // Update a mentor activity by ID
// exports.updateMentorActivity = async (req, res) => {
//     try {
//         const activity = await MentorActivity.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!activity) {
//             return res.status(404).json({ error: 'Mentor activity not found' });
//         }
//         res.json(activity);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// };

// // Delete a mentor activity by ID
// exports.deleteMentorActivity = async (req, res) => {
//     try {
//         const activity = await MentorActivity.findByIdAndDelete(req.params.id);
//         if (!activity) {
//             return res.status(404).json({ error: 'Mentor activity not found' });
//         }
//         res.json({ message: 'Mentor activity deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// };