
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
      "fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 text-white shadow-lg p-3 transition-all duration-300 hover:scale-110 hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300",
      "md:bottom-6 md:right-6",
      "hover:shadow-blue-500/25"
    )}
  >
    <MessageCircle className="w-5 h-5" />
  </button>
);

export default ChatButton;
