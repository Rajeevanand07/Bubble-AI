const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    api_key: process.env.GEMINI_API_KEY
});

async function generateAIResponse(content) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: content
    });

    return response.text;
}

module.exports = {
    generateAIResponse
}