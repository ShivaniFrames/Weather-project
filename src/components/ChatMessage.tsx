
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-2`}>
    <div
      className={`rounded-lg px-3 py-2 max-w-[85%] text-sm transition-all shadow-sm
      ${msg.from === "user" 
        ? "bg-blue-500 text-white rounded-br-sm" 
        : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
      }`}
    >
      {msg.text}
    </div>
  </div>
);

export default ChatMessage;
