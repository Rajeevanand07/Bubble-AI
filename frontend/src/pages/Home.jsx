import { useEffect, useState } from "react";
import { BsPlus, BsSend } from "react-icons/bs";
import { io } from "socket.io-client";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { asyncSetMessages } from "../actions/messageAction";

// Typing indicator component
const TypingIndicator = () => (
  <div className="flex space-x-1 p-3 bg-[#10101053] text-white self-start rounded-4xl max-w-xs">
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
  </div>
);

const Home = () => {
  const [socket, setSocket] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { currentChat } = useSelector((state) => state.chats);
  const { messages } = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  
  const handleSend = () => {
    if (inputValue.trim()) {
      socket.emit("ai-message", {
        chat: currentChat,
        content: inputValue,
      });
      setInputValue("");
      setIsTyping(true);
      dispatch(asyncSetMessages(currentChat));
    }
  };

  useEffect(() => {
  const tempSocket = io("http://localhost:3000", {
    withCredentials: true
  });
  
  setSocket(tempSocket);

  return () => {
    tempSocket.disconnect();
  };
}, []); // Empty dependency array means this runs once on mount

useEffect(() => {
  if (!socket) return;

  const handleAIResponse = (data) => {
    dispatch(asyncSetMessages(currentChat)).then(() => {
      setIsTyping(false);
    });
  };

  socket.on("ai-response", handleAIResponse);

  // Clean up the event listener when the effect re-runs
  return () => {
    socket.off("ai-response", handleAIResponse);
  };
}, [socket, currentChat, dispatch]); // Now this effect only re-runs when these deps change

  return (
    <div className="flex min-h-[90vh] items-center">
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {messages.length === 0 ? (
          <div className="w-full max-w-5xl text-center">
            <h1 className="text-6xl font-bold my-20">What can I help with?</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card text="Suggest beautiful places to see on an upcoming road trip" />
              <Card text="Briefly summarize this concept: urban planning" />
              <Card text="Brainstorm team bonding activities for our work retreat" />
              <Card text="Tell me about the latest advancements in AI" />
            </div>
          </div>
        ) : (
           <div className="h-[70vh] overflow-auto pb-20 flex flex-col items-center gap-4 w-full">
            <div className="w-5xl">
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`px-8 py-3 text-2xl rounded-4xl max-w-2xl break-all ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#096FFC] to-[#05C7F2] text-white self-end"
                        : "bg-[#10101053] text-white self-start"
                    }`}
                  >
                    {message.content}
                  </div>
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            </div>
          </div>
        )}
        <div className="w-full">
          <div className="w-full max-w-5xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                <BsPlus className="text-2xl text-gray-400" />
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="w-full p-4 pl-15 pr-20 rounded-full bg-gray-800 text-white border text-2xl border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask anything"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button 
                  type="button"
                  onClick={handleSend}
                  className="p-3 rounded-full hover:bg-gray-700"
                >
                  <BsSend className="text-2xl text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;