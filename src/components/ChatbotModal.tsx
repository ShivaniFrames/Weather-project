
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
      <DialogContent className="sm:max-w-sm w-[90vw] max-h-[70vh] p-0 overflow-hidden bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 shadow-2xl shadow-blue-500/10">
        <DialogHeader className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-sm px-4 py-3 border-b border-gray-700/50">
          <DialogTitle className="flex justify-between items-center text-white text-sm">
            🤖 WeatherBot
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowKeyInput((s) => !s)}
              className="text-gray-300 hover:bg-gray-700/50 hover:text-white text-xs h-6 px-2 transition-all"
            >
              {showKeyInput ? "Hide Key" : "API Key"}
            </Button>
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-xs">
            Your AI weather companion! 🌦️
          </DialogDescription>
        </DialogHeader>

        <div className="h-[250px] overflow-y-auto px-3 pt-3 bg-gradient-to-b from-gray-900/50 to-gray-800/50 backdrop-blur-sm">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
          {aiTyping && (
            <div className="flex items-center space-x-2 my-2">
              <Loader2 className="animate-spin w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm">AI is typing...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showKeyInput && (
          <div className="p-3 bg-gray-800/60 backdrop-blur-sm rounded-lg flex flex-col gap-2 mx-3 mb-2 border border-gray-700/30">
            <label className="text-xs font-medium text-gray-300">
              Gemini API Key
            </label>
            <Input
              type="password"
              placeholder="Paste API Key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-xs h-8 bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 backdrop-blur-sm"
            />
            <span className="text-xs text-gray-400">Stored locally only</span>
          </div>
        )}

        <form className="flex items-center gap-2 border-t border-gray-700/50 p-3 bg-gray-800/60 backdrop-blur-sm" onSubmit={handleSend}>
          <Input
            type="text"
            className="flex-1 h-8 text-sm bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 backdrop-blur-sm"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiTyping}
            autoFocus
          />
          <Button 
            type="submit" 
            disabled={aiTyping || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 h-8 px-3 text-xs transition-all hover:shadow-blue-500/25 backdrop-blur-sm"
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;
