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
      origin: "http://localhost:5173",
      credentials: true,
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

      const [message, vector] = await Promise.all([
        messageModel.create({
          //creating message in mongodb
          user: socket.user._id,
          chat: data.chat,
          content: data.content,
          role: "user",
        }),
        aiService.generateVectors(data.content), //generating vectors of the user message
      ]);

      const [memory, chatHistory] = await Promise.all([
        vectorService.queryMemory({  //getting(querying) from the LTM
          vector: vector,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }),
        (await messageModel  //getting data from mongoDB(STM)
            .find({
              chat: data.chat,
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean()
        ).reverse(),
      ]);

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
                ${memory
                  .map((message) => `${message.metadata.message}`)
                  .join("\n")}

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

      const response = await aiService.generateAIResponse(
        //generating response from AI
        [...ltm, ...smt]
      );

      socket.emit("ai-response", response);

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
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });
  });
}

module.exports = initSocketServer;
