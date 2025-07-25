const mongoose = require('mongoose');
const chatSchema = new mongoose.Schema({
    sessionId: { type: String, required: true },
    userMessage: { type: String, required: true },
    botResponse: { type: String, required: true },
}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);
module.exports = Chat;