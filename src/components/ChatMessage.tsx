
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-fade-in`}>
    <div
      className={`rounded-xl px-3 py-2 max-w-[80%] mb-2 shadow-sm text-sm transition-all hover:shadow-md backdrop-blur-sm
      ${msg.from === "user" 
        ? "bg-blue-600 text-white shadow-blue-500/20 hover:bg-blue-700" 
        : "bg-white/90 border border-blue-200/50 text-blue-900 hover:bg-blue-50/90"
      }`}
    >
      {msg.text}
    </div>
  </div>
);

export default ChatMessage;
