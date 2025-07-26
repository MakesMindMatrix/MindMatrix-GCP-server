const asyncHandler = require('../middleware/asyncHandler');
const ErrorHandler = require('../utils/errorHandler');
const Chat = require('../models/chat.model');
const axios = require('axios');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const headers = {
    'Content-Type': 'application/json',
    'x-goog-api-key': process.env.GEMINI_API_KEY,
};

exports.createChat = asyncHandler(async (req, res, next) => {
   const { userMessage, sessionId } = req.body;

    if (!userMessage || !sessionId) {
        return next(new ErrorHandler('User message and sessionId are required', 400));
    }

    console.log("Chat request received");

    // Step 1: Get prior messages for the session
    const previousChats = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    // Step 2: Convert to Gemini-compatible format
    const chatHistory = previousChats.flatMap(chat => ([
        {
            role: "user",
            parts: [{ text: chat.userMessage }]
        },
        {
            role: "model",
            parts: [{ text: chat.botResponse }]
        }
    ]));

    // Step 3: Add new user message
    chatHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    // Step 4: Send full conversation to Gemini API
    const botResponse = await axios.post(
        `${GEMINI_API_URL}`,
        { contents: chatHistory },
        { headers }
    );

    // Step 5: Extract bot response text
    const botReply = botResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const botData = botResponse?.data;

    if (!botReply) {
        return next(new ErrorHandler('Failed to get a response from Gemini', 500));
    }

    // Step 6: Store user-bot message pair in DB
    await Chat.create({
        sessionId,
        userMessage,
        botResponse: botReply,
    });

    // Step 7: Return updated full conversation history
    const updatedChatHistory = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    res.status(201).json({
        success: true,
        data: updatedChatHistory,
        botData,
        chatHistory: chatHistory,
    });
});

exports.getChatHistory = asyncHandler(async (req, res, next) => {
    const { sessionId } = req.params;

    if (!sessionId) {
        return next(new ErrorHandler('Session ID is required', 400));
    }

    const chatHistory = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    if (chatHistory.length === 0) {
        return next(new ErrorHandler('No chat history found for this session', 404));
    }

    res.status(200).json({
        success: true,
        data: chatHistory,
    }); 
});