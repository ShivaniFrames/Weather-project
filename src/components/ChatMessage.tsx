
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex mb-3 animate-fade-in ${
    msg.from === "user" ? "justify-end" : "justify-start"
  }`}>
    <div
      className={`rounded-2xl px-4 py-2 max-w-[80%] shadow-sm transition-all hover:shadow-md backdrop-blur-sm ${
        msg.from === "user"
          ? "bg-blue-500/90 text-white shadow-blue-500/20 hover:bg-blue-600/90"
          : "bg-white/80 border border-white/30 text-gray-800 hover:bg-white/90"
      }`}
    >
      <span className="text-sm">{msg.text}</span>
    </div>
  </div>
);

export default ChatMessage;
