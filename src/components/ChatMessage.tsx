
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} mb-3 animate-fade-in`}>
    <div
      className={`rounded-2xl px-4 py-3 max-w-[80%] shadow-sm text-sm transition-all
      ${msg.from === "user" 
        ? "bg-blue-500 text-white rounded-br-md" 
        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
      }`}
    >
      {msg.text}
    </div>
  </div>
);

export default ChatMessage;
