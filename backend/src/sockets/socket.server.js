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
      const message = await messageModel.create({
        user: socket.user._id,
        chat: data.chat,
        content: data.content,
        role: "user",
      });

      const vector = await aiService.generateVectors(data.content);

      await vectorService.createMemory({
        messageId: message._id,
        vector: vector,
        metadata: {
          chat: message.chat,
          user: socket.user._id,
          message: message.content,
        },
      });

      const chatHistory = (
        await messageModel
          .find({
            chat: data.chat,
          })
          .sort({ createdAt: -1 })
          .limit(10)
          .lean()
      ).reverse();

      const response = await aiService.generateAIResponse(
        chatHistory.map((message) => {
          return {
            role: message.role,
            parts: [{ text: message.content }],
          };
        })
      );

      const responseMessage = await messageModel.create({
        user: socket.user._id,
        chat: data.chat,
        content: response,
        role: "model",
      });

      await vectorService.createMemory({
        messageId: responseMessage._id,
        vector: vector,
        metadata: {
          chat: responseMessage.chat,
          user: socket.user._id,
          message: responseMessage.content,
        },
      });

      const memory = await vectorService.queryMemory({
        vector: vector,
        limit: 3,
        metadata: {},
      });
      console.log(memory);


      socket.emit("ai-response", responseMessage.content);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = initSocketServer;
