
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
      setInput("");
      setAITyping(false);
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white/30 backdrop-blur-md border border-white/30 shadow-xl">
        <DialogHeader className="bg-gradient-to-b from-primary/70 to-background/40 px-6 py-4">
          <DialogTitle className="flex justify-between items-center">
            Gemini WeatherBot
            <Button variant="ghost" size="sm" onClick={() => setShowKeyInput((s) => !s)}>
              {showKeyInput ? "Hide API Key" : "Set API Key"}
            </Button>
          </DialogTitle>
          <DialogDescription className="opacity-70">
            Chat with your AI weather buddy! 🌦️
          </DialogDescription>
        </DialogHeader>

        <div className="h-[350px] md:h-[400px] overflow-y-auto px-4 pt-4 bg-transparent">
          {messages.map((msg, idx) => (
            <ChatMessage key={idx} msg={msg} />
          ))}
          {aiTyping && (
            <div className="flex items-center space-x-2 my-2">
              <Loader2 className="animate-spin w-5 h-5 text-accent-foreground" />
              <span className="text-accent-foreground">AI is typing...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {showKeyInput && (
          <div className="p-4 bg-white/40 backdrop-blur rounded-lg flex flex-col gap-2">
            <label className="text-xs font-medium opacity-70">
              Gemini API Key (get from Google AI Studio)
            </label>
            <Input
              type="password"
              placeholder="Paste Gemini API Key here..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <span className="text-xs text-muted-foreground">Your key is only used locally and is never shared.</span>
          </div>
        )}

        <form className="flex items-center gap-2 border-t p-4 bg-white/20 backdrop-blur" onSubmit={handleSend}>
          <Input
            type="text"
            className="flex-1"
            placeholder="Send a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={aiTyping}
            autoFocus
          />
          <Button type="submit" disabled={aiTyping || !input.trim()}>Send</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChatbotModal;

