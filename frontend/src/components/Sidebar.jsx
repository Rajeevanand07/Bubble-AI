import { useEffect, useState } from "react";
import {
  BsLayoutSidebar,
  BsPencilSquare,
  BsX,
  BsChatDots,
} from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { createChat, getChats, getCurrentUserChat } from "../actions/chatAction";
import { asyncSetMessages } from "../actions/messageAction";

const NewChatPopup = ({ onClose, onSubmit, isLoading }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSubmit(title.trim());
      setTitle("");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000dc] bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black">New Chat</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            disabled={isLoading}
          >
            <BsX size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="chatTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter chat title"
              autoFocus
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 rounded-lg border cursor-pointer border-gray-600 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-[#096FFC] to-[#05C7F2] cursor-pointer text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isLoading ? "Creating..." : "Create Chat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { chats,currentChat } = useSelector((state) => state.chats);
  const dispatch = useDispatch();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNewChatPopup, setShowNewChatPopup] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    dispatch(getChats());
  }, []);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleNewChat = async (title) => {
    try {
      setIsCreating(true);
      dispatch(createChat(title));
    } catch (error) {
      console.error("Error creating chat:", error);
    } finally {
      setIsCreating(false);
      setShowNewChatPopup(false);
    }
  };

  const handleChatClick = async (chatId) => {
    try {
      dispatch(asyncSetMessages(chatId));
      dispatch(getCurrentUserChat(chatId));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div
      className={`h-screen border-r-[1.5px] border-[#635c5c80] py-10 px-6 transition-all duration-300 ${
        isExpanded ? "w-100" : "w-16"
      }`}
    >
      <div
        className={`flex ${
          isExpanded
            ? "justify-between items-center"
            : "flex-col items-center gap-8"
        }`}
      >
        <div
          className={`flex items-center gap-2 ${isExpanded ? "order-2" : ""}`}
        >
          <BsLayoutSidebar
            className="text-2xl cursor-pointer hover:text-gray-300 transition-colors"
            onClick={toggleSidebar}
          />
        </div>
        <div
          onClick={() => setShowNewChatPopup(true)}
          className={`flex items-center justify-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${
            isExpanded ? "order-1" : ""
          }`}
        >
          <BsPencilSquare className="text-2xl" />
          {isExpanded && (
            <span className="text-nowrap pl-3 text-xl">New Chat</span>
          )}
        </div>
      </div>

      {/* Chats List */}
      {isExpanded && (
        <div className="mt-8">
          <div className="flex items-center gap-2 text-gray-400 mb-4 px-2">
            <BsChatDots className="text-xl" />
            <h3 className="text-lg font-medium">Chats</h3>
          </div>

          <div className="space-y-1 max-h-[calc(100vh-250px)] overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => handleChatClick(chat._id)}
                className={`p-3 transition-all duration-300 ease-in-out hover:bg-gray-800 rounded-lg cursor-pointer flex items-center gap-3 ${
                  currentChat === chat._id ? "bg-gray-800" : ""
                }`}
              >
                <span className="truncate capitalize text-xl">
                  {chat.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showNewChatPopup && (
        <NewChatPopup
          onClose={() => !isCreating && setShowNewChatPopup(false)}
          onSubmit={handleNewChat}
          isLoading={isCreating}
        />
      )}
    </div>
  );
};

export default Sidebar;
