"use client";

import { useState } from "react";
// your mutation hook
import { cn } from "@/lib/utils";
import { useCreateChat } from "../../hooks";

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const mutation = useCreateChat();

  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || mutation.isPending) return;

    mutation.mutate({
      data: {
        conversationId,
        message: trimmed,
      },
    });

    setMessage(""); // Clear input after send
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center border-t px-4 py-2 bg-white">
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        disabled={mutation.isPending}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || mutation.isPending}
        className={cn(
          "px-4 py-2 text-white rounded-full transition-all duration-150",
          message.trim()
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-300 cursor-not-allowed"
        )}
      >
        Send
      </button>
    </div>
  );
}
