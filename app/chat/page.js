"use client";
import { useState, useRef, useEffect } from "react";
import { addChatMessage, getChatMessages } from "../../lib/db";

const quickPrompts = [
  { label: "Adapt today's session", emoji: "🔄", prompt: "My energy is low today. Should I modify today's workout or swap for something easier?" },
  { label: "Race strategy", emoji: "🏁", prompt: "Generate a pacing strategy for the Aveiro Half Marathon based on my current fitness." },
  { label: "Fuelling plan", emoji: "⚡", prompt: "Create a race-day fuelling timeline for a 21.1km half marathon using my Nduranz products." },
  { label: "Burnout check", emoji: "💛", prompt: "My work has been heavy this week. Should I adjust my training?" },
  { label: "Gym swap", emoji: "🏋️", prompt: "My right knee feels stiff today. Suggest ACL-safe alternatives for today's leg exercises." },
  { label: "Weekly review", emoji: "📊", prompt: "Review my training this week and suggest adjustments for next week." },
];

function Message({ role, content, isLoading }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
        role === "user"
          ? "bg-brand-600 text-white"
          : "bg-surface-850 border border-white/5 text-gray-200"
      }`}>
        {role === "assistant" && <div className="text-[10px] text-gray-500 mb-1 font-medium">AI Coach · Llama 3.3</div>}
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
            <span className="text-gray-500 text-xs">Analyzing your data...</span>
          </div>
        ) : (
          <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const messagesEndRef = useRef(null);

  // Load chat history from Supabase
  useEffect(() => {
    async function loadHistory() {
      const history = await getChatMessages(50);
      if (history && history.length > 0) {
        setMessages(history.map((m) => ({ role: m.role, content: m.content })));
      }
      setLoaded(true);
    }
    loadHistory();
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (text) => {
    const msg = text || input;
    if (!msg.trim() || isLoading) return;
    setInput("");

    const userMsg = { role: "user", content: msg };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Save user message to Supabase
    addChatMessage({ role: "user", content: msg, model: null });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-10), // last 10 messages for context
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "API error");
      }

      const data = await res.json();
      const assistantMsg = { role: "assistant", content: data.reply };
      setMessages([...newMessages, assistantMsg]);

      // Save assistant message to Supabase
      addChatMessage({ role: "assistant", content: data.reply, model: "llama-3.3-70b" });
    } catch (err) {
      console.error("Chat error:", err);
      const errorMsg = { role: "assistant", content: `Sorry, I couldn't connect to the AI. Error: ${err.message}\n\nMake sure your Gemini API key is set in .env.local and restart the dev server.` };
      setMessages([...newMessages, errorMsg]);
    }

    setIsLoading(false);
  };

  const clearHistory = async () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 pb-3 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">AI Coach</h1>
            <p className="text-sm text-gray-500 mt-1">Powered by Llama 3.3 via Groq · Has access to your live training data</p>
          </div>
          {messages.length > 0 && (
            <button onClick={clearHistory} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/10">
              Clear chat
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 && loaded && (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🤖</div>
            <h2 className="text-lg font-medium text-gray-300 mb-2">Hey Alexandre</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              I'm your AI training coach. I can see your live fitness data, race calendar, gym routine, and injury history. Ask me anything.
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <Message role="assistant" content="" isLoading />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts — show only when no messages */}
      {messages.length === 0 && loaded && (
        <div className="px-6 pb-3">
          <div className="grid grid-cols-3 gap-2">
            {quickPrompts.map((qp) => (
              <button
                key={qp.label}
                onClick={() => sendMessage(qp.prompt)}
                className="text-left p-3 bg-surface-850 border border-white/5 rounded-lg hover:border-brand-500/30 hover:bg-brand-600/5 transition-all"
              >
                <div className="text-sm mb-0.5">{qp.emoji} {qp.label}</div>
                <div className="text-[10px] text-gray-500 line-clamp-2">{qp.prompt}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/5">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            placeholder="Ask about training, races, nutrition, recovery..."
            disabled={isLoading}
            className="flex-1 bg-surface-850 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500/50 disabled:opacity-50"
          />
          <button
            onClick={() => sendMessage()}
            disabled={isLoading || !input.trim()}
            className="px-5 py-3 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
