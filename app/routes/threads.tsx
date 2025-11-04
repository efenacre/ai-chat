import type { Route } from "./+types/threads";
import { Link } from "react-router";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Past Chat Threads - AI Chat App" },
    { name: "description", content: "View your past chat conversations" },
  ];
}

interface ChatThread {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

export default function Threads() {
  // Mock data - in production, this would come from a backend/API
  const [threads] = useState<ChatThread[]>([
    {
      id: "1",
      title: "Project Discussion",
      lastMessage: "Thanks for the information!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 12,
    },
    {
      id: "2",
      title: "Technical Questions",
      lastMessage: "That makes sense. Let me try that approach.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 8,
    },
    {
      id: "3",
      title: "Code Review Help",
      lastMessage: "I'll implement those changes.",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      messageCount: 15,
    },
  ]);

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Past Chat Threads
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and continue your previous conversations
          </p>
        </div>

        {threads.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900 dark:text-white">
              No chat threads
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Start a new conversation to see it here.
            </p>
            <div className="mt-6">
              <Link
                to="/chat?new=true"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Start New Chat
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {threads.map((thread) => (
              <Link
                key={thread.id}
                to={`/chat?thread=${thread.id}`}
                className="block bg-white dark:bg-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                      {thread.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 truncate">
                      {thread.lastMessage}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{thread.messageCount} messages</span>
                      <span>•</span>
                      <span>{formatTimestamp(thread.timestamp)}</span>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
