
import React from "react";

export type ChatMsg = {
  from: "user" | "ai";
  text: string;
};

const ChatMessage = ({ msg }: { msg: ChatMsg }) => (
  <div className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
    <div
      className={`rounded-xl px-4 py-2 max-w-[80%] mb-2 shadow 
      ${msg.from === "user" ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"}`}
    >
      {msg.text}
    </div>
  </div>
);

export default ChatMessage;
