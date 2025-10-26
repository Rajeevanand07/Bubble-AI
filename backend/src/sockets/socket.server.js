require("dotenv").config();
const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const aiService = require("../services/ai.service");
const vectorService = require("../services/vector.service");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.use(async (socket, next) => {
    //middleware
    const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

    if (!cookies) {
      return next(new Error("Authentication error : No cookies found"));
    }

    try {
      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);
      socket.user = user;
      next();
    } catch (error) {
      return next(new Error("Authentication error : Invalid token"));
    }
  });

  io.on("connection", async (socket) => {
    console.log("a user connected");

    socket.on("ai-message", async (data) => {
      //listening to ai-message event
      const message = await messageModel.create({
        //creating message in mongodb
        user: socket.user._id,
        chat: data.chat,
        content: data.content,
        role: "user",
      });

      const vector = await aiService.generateVectors(data.content); //generating vector for user message

      const memory = await vectorService.queryMemory({
        vector: vector,
        limit: 3,
        metadata: {
          user: socket.user._id
        },
      });

      await vectorService.createMemory({
        //creating memory in pinecone with adding vector and metadata
        messageId: message._id,
        vector: vector,
        metadata: {
          chat: message.chat,
          user: socket.user._id,
          message: message.content,
        },
      });

      const chatHistory = //fetching chat history(for STM)
      (
        await messageModel
          .find({
            chat: data.chat,
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).reverse();

      const smt = chatHistory.map((message) => {
        return {
          role: message.role,
          parts: [{ text: message.content }],
        };
      });

      const ltm = [
        {
          role: "user",
          parts: [
            {
              text: `Here are previous chat messages.
                Use this memory to understand the user's context, preferences, and communication style.
                Only use information that is relevant to the user's current query.

                Previous chat history:
                ${memory.map((message) => `${message.metadata.message}`).join("\n")}

                When generating your next response:
                - Refer to the past messages to stay consistent.
                - Preserve any ongoing context, preferences, or tone.
                - Do not repeat the same past messages; instead, build upon them naturally.
                - If something from the memory seems outdated or irrelevant, ignore it.
              `,
            },
          ],
        },
      ];

      const response = await aiService
        .generateAIResponse //generating response from AI
        ([...ltm, ...smt]);

      const responseMessage = await messageModel.create({
        //creating response message in mongodb
        user: socket.user._id,
        chat: data.chat,
        content: response,
        role: "model",
      });

      const responseVector = await aiService.generateVectors(response); //generating vector for AI response

      await vectorService.createMemory({
        //creating memory in pinecone with adding vector and metadata
        messageId: responseMessage._id,
        vector: responseVector,
        metadata: {
          chat: responseMessage.chat,
          user: socket.user._id,
          message: responseMessage.content,
        },
      });

      socket.emit("ai-response", responseMessage.content);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = initSocketServer;
