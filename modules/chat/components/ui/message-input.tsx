"use client";

import React, { useRef, useState } from "react";
// your mutation hook
import { cn } from "@/lib/utils";
import { useCreateChat, useTyping } from "../../hooks";

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const mutation = useCreateChat();
  const typingMutation = useTyping();

  const lastTypingTimeRef = useRef<number>(0);
  const typingDelay = 100; // for delay maybe 1500 or 2000 for instance 0
  const sendTypingSignal = () => {
    const now = Date.now();
    if (now - lastTypingTimeRef.current < typingDelay) return;

    lastTypingTimeRef.current = now;
    typingMutation.mutate({ data: { conversationId } });
  };
  const handleSend = () => {
    const trimmed = message.trim();
    if (!trimmed || mutation.isPending) return;

    mutation.mutate({
      data: {
        conversationId,
        message: trimmed,
      },
    });

    setMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    sendTypingSignal();
  };
  return (
    <div className="flex items-center border-t px-4 py-2 bg-white">
      <input
        type="text"
        placeholder="Type a message"
        className="flex-1 rounded-full px-4 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 mr-2"
        value={message}
        onChange={handleChange}
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
