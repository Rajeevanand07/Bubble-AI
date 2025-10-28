import { useState } from "react";
import { BsLayoutSidebar } from "react-icons/bs";
import { BsPencilSquare } from "react-icons/bs";

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className={`h-screen border-r-[1.5px] border-[#635c5c80] py-10 px-6 transition-all duration-300 ${isExpanded ? "w-100" : "w-16"}`}>
      <div className={`flex ${isExpanded ? "justify-between items-center" : "flex-col items-center gap-8"}`}>
        <div className={`flex items-center gap-2 ${isExpanded ? "order-2" : ""}`}>
            <BsLayoutSidebar className="text-2xl cursor-e-resize" onClick={toggleSidebar} />
        </div>
        <div className={`flex items-center justify-center gap-2 cursor-pointer ${isExpanded ? "order-1" : ""}`}>
          <BsPencilSquare className="text-2xl" />
          {isExpanded && <span className="text-nowrap pl-3 text-xl">New Chat</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;