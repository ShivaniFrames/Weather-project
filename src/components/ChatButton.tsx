
import React from "react";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatButtonProps = {
  onClick: () => void;
};

const ChatButton = ({ onClick }: ChatButtonProps) => (
  <button
    onClick={onClick}
    aria-label="Open chat"
    className={cn(
      "fixed bottom-6 right-6 z-50 rounded-full p-4 transition-all duration-300",
      "bg-white/20 backdrop-blur-md border border-white/30 shadow-lg",
      "hover:bg-white/30 hover:scale-110 hover:shadow-xl",
      "focus:outline-none focus:ring-4 focus:ring-blue-300/50",
      "animate-pulse hover:animate-none",
      "group"
    )}
  >
    <MessageCircle className="w-6 h-6 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
    
    {/* Floating notification dot */}
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-ping" />
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full" />
  </button>
);

export default ChatButton;
