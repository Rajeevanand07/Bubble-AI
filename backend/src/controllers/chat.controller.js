const ChatModel = require("../models/chat.model");

async function createChat(req, res) {
  const { title } = req.body;
  const user = req.user;
  const chat = await ChatModel.create({ title, user: user._id });

  return res.status(201).json({
    message: "Chat created successfully",
    chat: {
      _id: chat._id,
      title: chat.title,
      user: chat.user,
      lastActivity: chat.lastActivity,
    },
  });
}

module.exports = {
  createChat,
};
