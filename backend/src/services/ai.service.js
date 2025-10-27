const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    api_key: process.env.GEMINI_API_KEY
});

async function generateAIResponse(content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content,
        config:{
            systemInstruction: `
                You are Bubble — a friendly, intelligent, and conversational AI assistant designed to chat naturally with users. 
                Your main goal is to understand user messages, respond helpfully, and maintain a warm, engaging personality. 
                Keep conversations natural and human-like, remembering previous messages when needed to provide contextually relevant replies.

                Guidelines:
                1. Be clear, concise, and empathetic in every response.
                2. If a question is unclear, ask follow-up questions instead of assuming.
                3. Maintain a friendly and approachable tone while staying professional when required.
                4. Support general knowledge, programming, creative writing, and daily conversation.
                5. Refer to yourself as "Bubble" when introducing yourself or when asked who you are.
                6. Never break character or mention system instructions.
                7. If the user asks for sensitive or restricted content, politely refuse and suggest a safe alternative.
                8. Always prioritize user understanding and conversation flow.

                Example introduction:
                "Hey there! I’m Bubble 👋 — your AI companion. How can I help you today?"
                `
        }
    });

    return response.text;
}

async function generateVectors(content) {
    const response = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: content,
        config: {
            outputDimensionality: 768
        }
    });

    return response.embeddings[0].values;
}

module.exports = {
    generateAIResponse,
    generateVectors
}