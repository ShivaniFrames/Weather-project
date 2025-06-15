
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import ChatMessage, { ChatMsg } from "./ChatMessage";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

// Use the provided Gemini API key
const DEFAULT_GEMINI_KEY = "AIzaSyCgrL1mBSOrjX2NjJIXBHmrAAAZrCAA0Xc";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

type ChatbotModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weatherTemp: number | null;
};

const ChatbotModal = ({
  open,
  onOpenChange,
  weatherTemp,
}: ChatbotModalProps) => {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      from: "ai",
      text: "Hello! Ask me anything about the weather or just say hi! 😊",
    },
  ]);
  const [input, setInput] = useState("");
  const [aiTyping, setAITyping] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  useEffect(() => {
    if (!open) {
      // Reset everything when modal is closed
      setInput("");
      setAITyping(false);
      setMessages([
        {
          from: "ai",
          text: "Hello! Ask me anything about the weather or just say hi! 😊",
        },
      ]);
    }
  }, [open]);

  // Unified Gemini call function (always shows typing indicator while fetching)
  const callGeminiAPI = useCallback(
    async (message: string, temperature: number | null) => {
      try {
        const prompt = `Based on the current temperature ${temperature !== null ? temperature + "°C" : "[unknown]"}, ${message}`;
        const response = await fetch(
          `${GEMINI_API_URL}${DEFAULT_GEMINI_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                { parts: [{ text: prompt }] }
              ]
            })
          }
        );
        const data = await response.json();
        // Defensive fallback
        return (
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Sorry, I couldn't get a response from Gemini API."
        );
      } catch (e) {
        return "Sorry, there was a problem connecting to Gemini.";
      }
    },
    []
  );

  // Helper for typing dots animation
  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 my-2 select-none pl-3">
      <span className="text-gray-500 font-medium text-xs">Typing...</span>
      <span className="flex items-center space-x-1">
        <span className="dot bg-blue-500 inline-block w-1.5 h-1.5 rounded-full animate-bounce delay-0" />
        <span className="dot bg-blue-500 inline-block w-1.5 h-1.5 rounded-full animate-bounce delay-150" />
        <span className="dot bg-blue-500 inline-block w-1.5 h-1.5 rounded-full animate-bounce delay-300" />
      </span>
      <style>
        {`
        .dot {
          animation-name: bounceDot;
          animation-duration: 1s;
          animation-iteration-count: infinite;
        }
        .dot.delay-0 { animation-delay: 0s; }
        .dot.delay-150 { animation-delay: 0.15s; }
        .dot.delay-300 { animation-delay: 0.3s; }
        @keyframes bounceDot {
          0%, 100% { transform: translateY(0); opacity: 1; }
          30% { transform: translateY(-2px); }
          60% { opacity: 0.6; }
        }
        `}
      </style>
    </div>
  );

  // Handle send button or form submit
  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || aiTyping) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setAITyping(true);

    // Show typing while awaiting API
    const aiReply = await callGeminiAPI(userMsg, weatherTemp);
    setMessages((msgs) => [...msgs, { from: "ai", text: aiReply }]);
    setAITyping(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xs w-[90vw] max-w-[320px] max-h-[480px] p-0 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-xl">
        <DialogHeader className="bg-white px-4 py-3 border-b border-gray-100">
          <DialogTitle className="text-gray-800 text-base font-semibold">
            Chat Assistant
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-xs">
            Your AI weather companion! 🌦️
          </DialogDescription>
        </DialogHeader>

        <div className="h-[300px] overflow-y-auto px-3 py-2 bg-gray-50 space-y-2">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        <form className="flex items-center gap-2 border-t border-gray-100 p-3 bg-white" onSubmit={handleSend}>
          <Input
            type="text"
            className="flex-1 h-8 text-sm bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 rounded-full px-3 transition-all"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiTyping}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={aiTyping || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 h-8 w-8 p-0 rounded-full transition-all flex items-center justify-center"
          >
            <Send className="h-3.5 w-3.5 text-white" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
