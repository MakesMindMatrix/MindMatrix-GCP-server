const express = require('express');
const { createNoticeBoard, getAllNoticeBoards, getNoticeBoardbyId, updateNoticeBoardbyId, deleteNoticeBoardbyId } = require('../controllers/noticeBoard.controller');
const router = express.Router()

router.route("/noticeboard").post(createNoticeBoard);
router.route("/noticeboard").get(getAllNoticeBoards);
router.route("/noticeboard/:id").get(getNoticeBoardbyId);
router.route("/noticeboard/:id").put(updateNoticeBoardbyId);
router.route("/noticeboard/:id").delete(deleteNoticeBoardbyId);

module.exports = router;