
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`rounded-xl px-3 py-2 max-w-[80%] mb-2 shadow-sm text-sm transition-all hover:shadow-md backdrop-blur-sm
      ${msg.from === "user" 
        ? "bg-blue-600/90 text-white shadow-blue-500/20 hover:bg-blue-500/90" 
        : "bg-gray-800/80 border border-gray-700/50 text-gray-100 hover:bg-gray-700/80"
      }`}
    >
      {msg.text}
    </div>
  </div>
);

export default ChatMessage;
