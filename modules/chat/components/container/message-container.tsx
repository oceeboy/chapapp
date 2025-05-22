"use client";

import { useSearchParams } from "next/navigation";
import { MessageList } from "../ui/message-list";
import { HeaderBox } from "@/components/shared";
import { MessageInput } from "../ui/message-input";

export function MessageContainer() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversationId") as string;

  return (
    <div className="h-screen w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 rounded-xl shadow-sm p-4 border">
        <HeaderBox title="Messages" />
      </div>

      {/* Chat Body */}
      <div className="flex-1 min-h-0 overflow-hidden rounded-xl border bg-muted shadow-inner">
        <MessageList conversationId={conversationId} />
      </div>

      {/* Input */}
      <div className="pt-2">
        <MessageInput conversationId={conversationId} />
      </div>
    </div>
  );
}
