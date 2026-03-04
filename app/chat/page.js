"use client";
import { useState } from "react";

const quickPrompts = [
  { label: "Adapt today's session", emoji: "🔄", prompt: "My energy is low today. Should I modify today's bike intervals or swap for something easier?" },
  { label: "Race strategy", emoji: "🏁", prompt: "Generate a pacing strategy for the Aveiro Half Marathon based on my current fitness." },
  { label: "Fuelling plan", emoji: "⚡", prompt: "Create a race-day fuelling timeline for a 21.1km half marathon using my Nduranz products." },
  { label: "Burnout check", emoji: "💛", prompt: "My work has been heavy this week and I have a tempo run tomorrow. Should I adjust?" },
  { label: "Gym swap", emoji: "🏋️", prompt: "My right knee feels stiff today. Suggest ACL-safe alternatives for Gym A leg exercises." },
  { label: "Weekly review", emoji: "📊", prompt: "Review my training this week and suggest adjustments for next week." },
];

function Message({ role, content }) {
  return (
    <div className={`flex ${role === "user" ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[75%] rounded-xl px-4 py-3 text-sm ${
        role === "user"
          ? "bg-brand-600 text-white"
          : "bg-surface-850 border border-white/5 text-gray-200"
      }`}>
        {role === "assistant" && <div className="text-[10px] text-gray-500 mb-1 font-medium">Command Center AI</div>}
        <div className="whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hey Alexandre 👋\n\nI'm your AI training coach. I have access to your athlete profile, training data, race calendar, and work schedule.\n\nAsk me anything — or pick a quick prompt below to get started." },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text) => {
    const msg = text || input;
    if (!msg.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: msg },
      { role: "assistant", content: "🚧 AI responses will be powered by Gemini + Claude in Phase 2.\n\nThis is where the AI will analyze your training data, burnout signals, and work schedule to give personalized recommendations.\n\nFor now, the interface is ready — we just need to connect the API keys." },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 pb-3 border-b border-white/5">
        <h1 className="text-2xl font-bold text-white">Ask AI Coach</h1>
        <p className="text-sm text-gray-500 mt-1">Powered by Gemini (fast) + Claude (deep analysis)</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} content={msg.content} />
        ))}
      </div>

      {/* Quick prompts */}
      {messages.length <= 2 && (
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
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Ask about training, races, nutrition, recovery..."
            className="flex-1 bg-surface-850 border border-white/5 rounded-lg px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-500/50"
          />
          <button
            onClick={() => sendMessage()}
            className="px-5 py-3 bg-brand-600 text-white text-sm rounded-lg hover:bg-brand-700 transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
