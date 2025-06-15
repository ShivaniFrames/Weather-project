
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`rounded-xl px-3 py-2 max-w-[80%] mb-2 shadow-sm text-sm transition-all hover:shadow-md
      ${msg.from === "user" 
        ? "bg-blue-600 text-white" 
        : "bg-white border border-blue-200 text-blue-900 hover:bg-blue-50"
      }`}
    >
      {msg.text}
    </div>
  </div>
);

export default ChatMessage;
