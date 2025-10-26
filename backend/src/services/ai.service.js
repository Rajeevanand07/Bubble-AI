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