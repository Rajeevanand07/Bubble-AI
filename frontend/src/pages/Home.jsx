import { useEffect, useState } from "react";
import { BsPlus, BsSend } from "react-icons/bs";
import { io } from "socket.io-client";
import Card from "../components/Card";
import { useDispatch, useSelector } from "react-redux";
import { asyncSetMessages } from "../actions/messageAction";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

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
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const showWelcomeScreen = !currentChat || messages.length === 0;
  
  const handleSend = () => {
    if (inputValue.trim()) {
      socket.emit("ai-message", {
        chat: currentChat,
        content: inputValue,
      });
      setInputValue("");
      setIsTyping(true);
      if (user !== null) {
        dispatch(asyncSetMessages(currentChat));
      }
      else {
        navigate("/login");
      }
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
}, []); 

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
        {showWelcomeScreen ? (
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
            <div className="lg:w-3xl xl:w-5xl">
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`px-8 py-3 text-xl lg:text-2xl rounded-4xl md:max-w-xl lg:max-w-xl break-all ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-[#096FFC] to-[#05C7F2] text-white self-end"
                        : "bg-[#10101053] text-white self-start"
                    }`}
                  >
                    {message.role === "user" ? (
                      message.content
                    ) : (
                      <div className="prose prose-invert max-w-none 
                        prose-p:my-4 prose-p:leading-relaxed
                        prose-headings:mt-8 prose-headings:mb-4
                        prose-h1:text-4xl prose-h1:font-extrabold prose-h1:mb-6
                        prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4
                        prose-h3:text-2xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
                        prose-ul:my-4 prose-ol:my-4 prose-li:my-2 prose-li:leading-relaxed
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-400 prose-blockquote:pl-4 prose-blockquote:my-6
                        prose-hr:my-8 prose-hr:border-gray-600
                        prose-pre:bg-gray-800 prose-pre:p-4 prose-pre:rounded-lg prose-pre:my-6
                        prose-code:bg-gray-700 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                        prose-strong:text-blue-300 prose-strong:font-semibold
                        prose-a:text-blue-400 hover:prose-a:underline
                        prose-img:rounded-lg prose-img:my-6
                      ">
                        <ReactMarkdown 
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            h1: ({node, ...props}) => <h1 className="text-5xl font-extrabold mt-8 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-4xl font-bold mt-7 mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300" {...props} />,
                            p: ({node, ...props}) => <p className="my-4 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4 space-y-2" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4 space-y-2" {...props} />,
                            li: ({node, ...props}) => <li className="my-2 leading-relaxed" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-blue-400 pl-4 my-6 text-gray-300 italic" {...props} />,
                            hr: ({node, ...props}) => <hr className="my-8 border-gray-600" {...props} />,
                            code: ({node, inline, className, children, ...props}) => {
                              if (inline) {
                                return <code className="bg-gray-700 px-1.5 py-0.5 rounded text-sm" {...props} />
                              }
                              return <code className={className} {...props} />
                            },
                            pre: ({node, ...props}) => <pre className="p-4 rounded-lg my-5 overflow-x-auto" {...props} />
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
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