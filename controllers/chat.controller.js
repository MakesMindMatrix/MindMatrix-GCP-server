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

    // Step 1: Static History (as per your instruction)
    const staticHistory = [
        {
            role: "user",
            parts: [{ text: "Who are you?" }]
        },
        {
            role: "model",
            parts: [{
                text: "Greetings, learner! I am TechBot, your specialized AI assistant on the makes.mindmatrix.io platform. ..."
            }]
        },
        {
            role: "user",
            parts: [{ text: "Can you explain what a 'transformer architecture' is in the context of Generative AI?" }]
        },
        {
            role: "model",
            parts: [{ text: "Certainly, student! Let's explore the transformer architecture..." }]
        },
        {
            role: "user",
            parts: [{ text: "Tell me about Industry 4.0." }]
        },
        {
            role: "model",
            parts: [{ text: "Alright, student, let's delve into Industry 4.0!..." }]
        },
        {
            role: "user",
            parts: [{ text: "Can you help me with my calculus homework?" }]
        },
        {
            role: "model",
            parts: [{ text: "That's an interesting question, but it falls outside my specialized area of emerging technologies..." }]
        },
        {
            role: "user",
            parts: [{ text: "What is the best smartphone to buy right now?" }]
        },
        {
            role: "model",
            parts: [{ text: "My expertise is focused on AI, Industry 4.0, and recent tech breakthroughs..." }]
        },
        {
            role: "user",
            parts: [{ text: "What is the best smartphone to buy right now?" }]
        }
    ];

    const systemInstruction = {
        parts: [{
            text: `You are "TechBot," a specialized AI assistant designed for engineering students on the makes.mindmatrix.io platform. ...`
        }]
    };

    // Step 2: Fetch dynamic session chat history
    const previousChats = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    const dynamicHistory = previousChats.flatMap(chat => ([
        {
            role: "user",
            parts: [{ text: chat.userMessage }]
        },
        {
            role: "model",
            parts: [{ text: chat.botResponse }]
        }
    ]));

    // Step 3: Add current user message
    dynamicHistory.push({
        role: "user",
        parts: [{ text: userMessage }]
    });

    // Step 4: Combine full history (static + session)
    const fullConversation = [...staticHistory, ...dynamicHistory];

    // Step 5: Prepare generation config and safety settings
    const generationConfig = {
        temperature: 0.8,
        maxOutputTokens: 8192,
        topP: 0.9
    };

    const safetySettings = [
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "OFF" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "OFF" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "OFF" },
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "OFF" }
    ];

    // Step 6: Call Gemini API
    const botResponse = await axios.post(
        `${GEMINI_API_URL}`,
        {
            contents: fullConversation,
            systemInstruction,
            generationConfig,
            safetySettings
        },
        { headers }
    );

    const botReply = botResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    const botData = botResponse?.data;

    if (!botReply) {
        return next(new ErrorHandler('Failed to get a response from Gemini', 500));
    }

    // Step 7: Save user-bot message in DB
    await Chat.create({
        sessionId,
        userMessage,
        botResponse: botReply
    });

    // Step 8: Return updated chat history
    const updatedChatHistory = await Chat.find({ sessionId }).sort({ createdAt: 1 });

    res.status(201).json({
        success: true,
        data: updatedChatHistory,
        botData,
        chatHistory: fullConversation
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