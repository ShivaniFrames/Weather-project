
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

// Use the provided Gemini API key unless overridden by user
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
  const [apiKey, setApiKey] = useState(""); // Let user override API key if they want.
  const [showKeyInput, setShowKeyInput] = useState(false);

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
      const keyToUse = apiKey || DEFAULT_GEMINI_KEY;
      try {
        const prompt = `Based on the current temperature ${temperature !== null ? temperature + "°C" : "[unknown]"}, ${message}`;
        const response = await fetch(
          `${GEMINI_API_URL}${keyToUse}`,
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
    [apiKey]
  );

  // Helper for typing dots animation
  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 my-2 select-none">
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
      <DialogContent className="sm:max-w-md w-[95vw] max-w-[400px] max-h-[600px] p-0 overflow-hidden bg-white border border-gray-200 shadow-xl rounded-2xl">
        <DialogHeader className="bg-white px-6 py-4 border-b border-gray-100">
          <DialogTitle className="flex justify-between items-center text-gray-800 text-lg font-semibold">
            Chat Assistant
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowKeyInput((s) => !s)}
              className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 text-xs h-8 px-3 transition-all"
            >
              {showKeyInput ? "Hide Key" : "API Key"}
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-500 text-sm">
            Your AI weather companion! 🌦️
          </DialogDescription>
        </DialogHeader>

        <div className="h-[400px] overflow-y-auto px-4 pt-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {showKeyInput && (
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex flex-col gap-2">
            <label className="text-xs font-medium text-gray-600">
              Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="Paste API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs h-8 bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:border-blue-500"
            />
            <span className="text-xs text-gray-500">Stored locally only</span>
          </div>
        )}

        <form className="flex items-center gap-3 border-t border-gray-100 p-4 bg-white" onSubmit={handleSend}>
          <Input
            type="text"
            className="flex-1 h-10 text-sm bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:bg-white focus:border-blue-500 rounded-full px-4 transition-all"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiTyping}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={aiTyping || !input.trim()}
            className="bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0 rounded-full transition-all flex items-center justify-center"
          >
            <Send className="h-4 w-4 text-white" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
