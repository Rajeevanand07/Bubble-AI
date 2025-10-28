import Card from "../components/Card";
import { BsPlus, BsMic, BsSend } from "react-icons/bs";
import { useState } from "react";

const Home = () => {
  const [isChatActive, setIsChatActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setMessages([...messages, { text: inputValue, sender: "user" }]);
      setInputValue("");
      setIsChatActive(true);
    }
  };

  return (
    <div className="flex min-h-[90vh] items-center">
      <div className="flex-1 p-4 flex flex-col items-center justify-center">
        {!isChatActive ? (
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
          <div className="min-h-[70vh] flex flex-col items-center gap-4 w-full">
            <div className="w-5xl">
              <div className="flex flex-col gap-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`px-8 py-3 text-2xl rounded-4xl max-w-2xl break-all ${
                      message.sender === "user"
                        ? "bg-gradient-to-r from-[#096FFC] to-[#05C7F2] text-white self-end"
                        : " bg-[#10101053] text-white self-start"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
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
                className="w-full p-4 pl-15 pr-20 rounded-full bg-gray-800 text-white border text-2xl border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ask anything"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <button className="p-3 rounded-full hover:bg-gray-700">
                  <BsSend className="text-2xl text-gray-400" onClick={handleSend} />
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
