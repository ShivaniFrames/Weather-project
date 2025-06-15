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
import { Loader2 } from "lucide-react";

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

  // Enhanced typing indicator with modern animation
  const TypingIndicator = () => (
    <div className="flex items-center space-x-3 my-3 px-4 py-2 animate-fade-in">
      <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
      </div>
      <span className="text-blue-300 text-sm font-medium">typing</span>
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
      <DialogContent className="fixed bottom-6 right-6 w-80 max-w-[90vw] h-96 p-0 overflow-hidden bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl transform translate-x-0 translate-y-0 animate-slide-in-up">
        {/* Modern glassmorphism header */}
        <DialogHeader className="bg-gradient-to-r from-white/15 to-white/10 backdrop-blur-sm px-4 py-3 border-b border-white/20">
          <DialogTitle className="flex justify-between items-center text-gray-800 text-sm font-semibold">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>WeatherBot</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowKeyInput((s) => !s)}
              className="text-gray-600 hover:bg-white/20 hover:text-gray-800 text-xs h-6 px-2 transition-all rounded-lg"
            >
              {showKeyInput ? "Hide Key" : "API Key"}
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-xs">
            Your AI weather companion! 🌦️
          </DialogDescription>
        </DialogHeader>

        {/* Chat messages area with glassmorphism */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 bg-gradient-to-b from-white/5 to-white/10 backdrop-blur-sm">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex mb-3 animate-fade-in ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
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
          ))}
          {aiTyping && <TypingIndicator />}
          <div ref={bottomRef} />
        </div>

        {/* API Key input with glassmorphism */}
        {showKeyInput && (
          <div className="p-3 bg-white/10 backdrop-blur-sm rounded-lg flex flex-col gap-2 mx-3 mb-2 border border-white/20 animate-fade-in">
            <label className="text-xs font-medium text-gray-700">
              Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="Paste API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs h-8 bg-white/50 border-white/30 text-gray-800 placeholder-gray-500 focus:border-blue-500/50 backdrop-blur-sm rounded-lg"
            />
            <span className="text-xs text-gray-600">Stored locally only</span>
          </div>
        )}

        {/* Enhanced input area with hover effects */}
        <form className="flex items-center gap-3 border-t border-white/20 p-4 bg-white/10 backdrop-blur-sm" onSubmit={handleSend}>
          <Input
            type="text"
            className="flex-1 h-10 text-sm bg-white/50 border-white/30 text-gray-800 placeholder-gray-500 focus:border-blue-400 focus:shadow-[0_0_12px_rgba(59,130,246,0.5)] backdrop-blur-sm rounded-xl transition-all duration-300 hover:border-blue-300 hover:shadow-[0_0_8px_rgba(59,130,246,0.3)]"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiTyping}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={aiTyping || !input.trim()}
            className="bg-blue-500/90 hover:bg-blue-600/90 h-10 px-4 text-sm transition-all hover:shadow-lg backdrop-blur-sm rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
