import type { Route } from "./+types/chat";
import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router";

async function callMastra(city: string) {
  const res = await fetch(
    "http://localhost:4111/api/workflows/weatherWorkflow/start-async",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        inputData: { city },
        runtimeContext: {},
        tracingOptions: { metadata: { additionalProp1: {} } },
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  try {
    return await res.json();
  } catch {
    return null;
  }
}

function formatWeatherResponse(data: any) {
  if (!data) return "No response received.";

  const activities = data?.result?.activities;

  if (typeof activities === "string") {
    return activities;
  }

  if (Array.isArray(activities)) {
    // Join text content; stringify non-string items safely
    return activities
      .map((item) => {
        if (typeof item === "string") return item;
        try {
          return JSON.stringify(item);
        } catch {
          return String(item);
        }
      })
      .join("\n");
  }

  if (activities && typeof activities === "object") {
    try {
      return JSON.stringify(activities, null, 2);
    } catch {
      return String(activities);
    }
  }

  // Fallbacks when activities is missing
  const id = data?.id ?? data?.workflowId ?? data?.runId;
  if (id) {
    return `Workflow started. Id: ${id}`;
  }
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "AI Chat - AI Chat App" },
    { name: "description", content: "Chat with AI" },
  ];
}

export default function Chat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle new chat query parameter
  useEffect(() => {
    if (searchParams.get("new") === "true") {
      setMessages([{ role: "assistant", content: "Hello! How can I help you today?" }]);
      setSearchParams({}, { replace: true });
    }
    // In production, also handle thread loading here if thread ID is in query params
  }, [searchParams, setSearchParams]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const data = await callMastra(userMessage);
      const reply = formatWeatherResponse(data);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, the weather service is unavailable. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto px-4 py-6 min-h-0">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-3xl rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSend} className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
