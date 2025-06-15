
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
import { Loader2, Send } from "lucide-react";

// Use the provided Gemini API key unless overridden by user
const DEFAULT_GEMINI_KEY = "AIzaSyCgrL1mBSOrjX2NjJIXBHmrAAAZrCAA0Xc";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";

type ChatbotModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weatherTemp: number | null;
};

// Floating clouds component for chatbot background
const ChatbotClouds = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-10 -left-20 w-40 h-20 bg-blue-200/20 rounded-full blur-xl animate-float" />
    <div className="absolute top-1/4 -right-16 w-32 h-16 bg-blue-300/15 rounded-full blur-lg animate-[float_25s_ease-in-out_infinite_reverse]" />
    <div className="absolute bottom-1/3 -left-12 w-28 h-14 bg-blue-100/10 rounded-full blur-lg animate-[float_30s_ease-in-out_infinite]" />
    <div className="absolute top-3/4 right-1/4 w-24 h-12 bg-blue-400/25 rounded-full blur-xl animate-[float_22s_ease-in-out_infinite_reverse]" />
  </div>
);

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
      <span className="text-blue-600 font-medium text-xs lowercase">typing</span>
      <span className="flex items-center space-x-1">
        <span className="dot bg-blue-600 inline-block w-1.5 h-1.5 rounded-full animate-bounce delay-0" />
        <span className="dot bg-blue-600 inline-block w-1.5 h-1.5 rounded-full animate-bounce delay-150" />
        <span className="dot bg-blue-600 inline-block w-1.5 h-1.5 rounded-full animate-bounce delay-300" />
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
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[80vh] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-blue-200/50 shadow-2xl relative mx-auto">
        <ChatbotClouds />
        
        <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 backdrop-blur-sm px-4 py-3 border-b border-blue-200/30 relative z-10">
          <DialogTitle className="flex justify-between items-center text-white text-sm">
            🤖 WeatherBot
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowKeyInput((s) => !s)}
              className="text-blue-100 hover:bg-blue-500/30 hover:text-white text-xs h-6 px-2 transition-all"
            >
              {showKeyInput ? "Hide Key" : "API Key"}
            </Button>
          </DialogTitle>
          <DialogDescription className="text-blue-100 text-xs">
            Your AI weather companion! 🌦️
          </DialogDescription>
        </DialogHeader>

        <div className="h-[300px] overflow-y-auto px-3 pt-3 bg-gradient-to-b from-blue-50/80 to-white/90 backdrop-blur-sm relative z-10">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {showKeyInput && (
          <div className="p-3 bg-blue-50/80 backdrop-blur-sm rounded-lg flex flex-col gap-2 mx-3 mb-2 border border-blue-200/50 relative z-10">
            <label className="text-xs font-medium text-blue-700">
              Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="Paste API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs h-8 bg-white/80 border-blue-200/50 text-blue-900 placeholder-blue-400 focus:border-blue-500 backdrop-blur-sm"
            />
            <span className="text-xs text-blue-600">Stored locally only</span>
          </div>
        )}

        <form className="flex items-center gap-2 border-t border-blue-200/50 p-3 bg-white/80 backdrop-blur-sm relative z-10" onSubmit={handleSend}>
          <Input
            type="text"
            className="flex-1 h-8 text-sm bg-white/90 border-blue-200/50 text-blue-900 placeholder-blue-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 backdrop-blur-sm transition-all hover:border-blue-400"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiTyping}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={aiTyping || !input.trim()}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700 h-8 w-8 transition-all hover:shadow-lg hover:shadow-blue-500/25 backdrop-blur-sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
