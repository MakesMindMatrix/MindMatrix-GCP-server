const ErrorHandler = require('../utils/errorHandler');
const asyncHandler = require('../middleware/asyncHandler');
const BuildProfileModel = require('../models/buildProfileActivity.model');

// Create build profile activity
exports.createBuildProfileActivity = asyncHandler(async (req, res, next) => {
    const { image, title, batch_id } = req.body;

    if (!image || !title || !batch_id) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    const newActivity = await BuildProfileModel.create({
        image,
        title,
        batch_id
    });

    res.status(201).json({
        success: true,
        data: newActivity
    });
})

// Get all activities
exports.getAllBuildProfileActivity = asyncHandler(async (req, res, next) => {
    const activities = await BuildProfileModel.find();

    res.status(200).json({
        success: true,
        data: activities
    });
})

// Get single activity by ID
exports.getBuildProfileActivity = asyncHandler(async (req, res, next) => {
    const activity = await BuildProfileModel.findById(req.params.id);

    if (!activity) {
        return next(new ErrorHandler('Activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: activity
    });
})

// Update activity by ID
exports.updateBuildProfileActivity = asyncHandler(async (req, res, next) => {
    const { image, title, batch_id } = req.body;

    if (!image || !title || !batch_id) {
        return next(new ErrorHandler('Please provide all required fields', 400));
    }

    const updatedActivity = await BuildProfileModel.findByIdAndUpdate(
        req.params.id,
        { image, title, batch_id },
        { new: true, runValidators: true }
    );

    if (!updatedActivity) {
        return next(new ErrorHandler('Activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: updatedActivity
    });
})

// Delete activity by ID
exports.deleteBuildProfileActivity = asyncHandler(async (req, res, next) => {
    const activity = await BuildProfileModel.findByIdAndDelete(req.params.id);

    if (!activity) {
        return next(new ErrorHandler('Activity not found', 404));
    }

    res.status(200).json({
        success: true,
        data: {}
    });
})


// router.post('/', (req, res) => {
//     const activity = { id: idCounter++, ...req.body };
//     activities.push(activity);
//     res.status(201).json(activity);
// });

// // Read all
// router.get('/', (req, res) => {
//     res.json(activities);
// });

// // Read one
// router.get('/:id', (req, res) => {
//     const activity = activities.find(a => a.id === parseInt(req.params.id));
//     if (!activity) return res.status(404).json({ message: 'Activity not found' });
//     res.json(activity);
// });

// // Update
// router.put('/:id', (req, res) => {
//     const index = activities.findIndex(a => a.id === parseInt(req.params.id));
//     if (index === -1) return res.status(404).json({ message: 'Activity not found' });
//     activities[index] = { ...activities[index], ...req.body };
//     res.json(activities[index]);
// });

// // Delete
// router.delete('/:id', (req, res) => {
//     const index = activities.findIndex(a => a.id === parseInt(req.params.id));
//     if (index === -1) return res.status(404).json({ message: 'Activity not found' });
//     const deleted = activities.splice(index, 1);
//     res.json(deleted[0]);
// });