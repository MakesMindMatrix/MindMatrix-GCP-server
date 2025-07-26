const express = require('express');
const { createChat, getChatHistory } = require('../controllers/chat.controller');
const router = express.Router();

router.route('/create-chat').post(createChat);
router.route('/get-chat/:sessionId').get(getChatHistory);

module.exports = router;

