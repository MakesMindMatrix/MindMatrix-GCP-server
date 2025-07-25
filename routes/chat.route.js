const express = require('express');
const { createChat } = require('../controllers/chat.controller');
const router = express.Router();

router.route('/create-chat').post(createChat);
module.exports = router;

