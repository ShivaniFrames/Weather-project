
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

type ChatbotModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weatherTemp: number | null;
};

const AI_TYPING_DELAY = 1200;

const GeminiAPI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=GEMINI_API_KEY";

// Call gemini, fallback to dummy if key missing
const callGeminiAPI = async (
  apiKey: string,
  message: string,
  weatherTemp: number | null
): Promise<string> => {
  if (!apiKey || apiKey === "GEMINI_API_KEY") {
    // Simulate generic AI message
    return new Promise((resolve) =>
      setTimeout(() => resolve("I'm a demo AI! 🌞 Please connect a Gemini API key for real responses."), 1200)
    );
  }
  const prompt = `Based on the current temperature ${weatherTemp !== null ? weatherTemp + "°C" : "[unknown]"}, ${message}`;
  const res = await fetch(GeminiAPI_URL.replace("GEMINI_API_KEY", apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        { parts: [{ text: prompt }] }
      ]
    })
  });
  const data = await res.json();
  const aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't get a response from Gemini API.";
  return aiText;
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
  const [apiKey, setApiKey] = useState(""); // User enters API key manually here.
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

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || aiTyping) return;
    const userMsg = input.trim();
    setMessages((msgs) => [...msgs, { from: "user", text: userMsg }]);
    setInput("");
    setAITyping(true);

    const aiReply = await callGeminiAPI(apiKey, userMsg, weatherTemp);
    setMessages((msgs) => [...msgs, { from: "ai", text: aiReply }]);
    setAITyping(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-b from-primary to-background px-6 py-4">
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

        <div className="h-[350px] md:h-[400px] overflow-y-auto px-4 pt-4 bg-background">
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
          <div className="p-4 bg-muted flex flex-col gap-2">
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

        <form className="flex items-center gap-2 border-t p-4 bg-background" onSubmit={handleSend}>
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
