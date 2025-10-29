const ChatModel = require("../models/chat.model");
const Message = require("../models/message.model") 

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

async function getChats(req, res) {
    const user = req.user;
    const chats = await ChatModel.find({ user: user._id });
    return res.status(200).json({
        message: "Chats fetched successfully",
        chats,
    });
}

async function getMessagesFromChat(req,res){
  const chatId = req.query;
  const messages = await Message.find({chat:chatId.chat})
  return res.status(200).json({
    message:"all messages",
    messages
  })
}

module.exports = {
  createChat,
  getChats,
  getMessagesFromChat
};
