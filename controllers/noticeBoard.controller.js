const asyncHandler = require('../middleware/asyncHandler')
const NoticeBoard = require('../models/noticeBoard.model')

// Controller for create new Notice Board
exports.createNoticeBoard = asyncHandler(async (req, res, next) => {
    try {
        const noticeBoard = new NoticeBoard(req.body);
        const savedNoticeBoard = await noticeBoard.save();

        res.status(201).json({
            success: true,
            message: "Notice Board created successfully",
            NoticeBoard: savedNoticeBoard});

    } catch (err) {
        
        res.status(400).json({
            success: false, 
            error: err.message });
    }
})

// Controller to read all NoticeBoards 
exports.getAllNoticeBoards = asyncHandler(async (req, res, next) => {

    try {
        const noticeboards = await NoticeBoard.find();
        res.status(200).json({
            success: true,
            message: "All Notice Boards fetched successfully",
            NoticeBoard: noticeboards});

    } catch (err) {
        
        res.status(500).json({ 
            success: false,
            error: err.message });
    }
})

// Controller to read one noticeboard based on id
exports.getNoticeBoardbyId = asyncHandler(async (req, res, next) => {

    try {
        const noticeboard = await NoticeBoard.findOne({ _id: req.params.id });
        if (!noticeboard) {
            return res.status(404).json({ 
                success: false,
                error: 'NoticeBoard not found' });
        }

        res.status(200).json({
            success: true, 
            message: "Single noticeboard fetched successfully", 
            NoticeBoard: noticeboard});

    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message });
    }
})

// Controller to update NoticeBoard
exports.updateNoticeBoardbyId = asyncHandler(async (req, res, next) => {
    try {
        const updatedBoard = await NoticeBoard.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedBoard) {
            return res.status(404).json({ 
                success: false,
                error: 'NoticeBoard not found' });
        }
        res.status(200).json({ 
            success: true, 
            message: "NoticeBoard updated successfully", 
            NoticeBoard: updatedBoard});
    } catch (err) {
        res.status(400).json({ 
            success: false,
            error: err.message });
    }
})

// Controller for delete NoticeBoard
exports.deleteNoticeBoardbyId = asyncHandler(async (req, res, next) => {
    try {
        const deletedBoard = await NoticeBoard.findOneAndDelete({ _id: req.params.id });
        if (!deletedBoard) {
            return res.status(404).json({ 
                success: false,
                error: 'NoticeBoard not found' });
        }
        res.status(200).json({ 
            success: true,
            message: 'NoticeBoard deleted successfully' });
    } catch (err) {
        res.status(500).json({ 
            success: false,
            error: err.message });
    }
})