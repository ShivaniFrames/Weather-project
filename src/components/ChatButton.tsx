
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
      "fixed bottom-6 right-6 z-50 rounded-full bg-primary text-primary-foreground shadow-lg p-4 transition-transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-ring",
      "md:bottom-8 md:right-8"
    )}
  >
    <MessageCircle className="w-7 h-7" />
  </button>
);

export default ChatButton;
