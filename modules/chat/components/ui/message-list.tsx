"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMessageById } from "../../hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import http from "@/lib/ky";

export function MessageList({ conversationId }: { conversationId: string }) {
  const { data: messages } = useMessageById(conversationId);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages?.messages, conversationId]);

  useEffect(() => {
    if (!messages?.messages.length) return;

    const lastMessageId = messages.messages[messages.messages.length - 1]._id;
    http.post("status/read", {
      json: {
        conversationId,
        lastReadMessageId: lastMessageId,
      },
    });
  }, [messages?.messages, conversationId]);

  if (!messages) return null;

  const { currentUserId, conversation } = messages;
  const otherUserId = conversation.participants.find(
    (id) => id !== currentUserId
  );
  const lastReadMessageId = conversation.readStatus.find(
    (r) => r.userId === otherUserId
  )?.lastReadMessageId;

  return (
    <ScrollArea className="h-full p-4 scroll-smooth rounded-xl bg-background border">
      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {messages.messages.map((msg) => {
            const isMe = msg.senderId._id === currentUserId;
            const username = isMe ? "You" : msg.senderId.userName;
            const isLastReadByOther = isMe && msg._id === lastReadMessageId;

            return (
              <motion.div
                key={msg._id}
                initial={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "flex items-end gap-3",
                  isMe ? "justify-end" : "justify-start"
                )}
              >
                {!isMe && (
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 max-w-xs sm:max-w-sm text-sm shadow-md transition-colors",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-2xl "
                  )}
                >
                  <div className="text-xs font-semibold text-muted-foreground mb-1">
                    {username}
                  </div>
                  <p className="break-words whitespace-pre-wrap">
                    {msg.message}
                  </p>
                  <div className="text-[10px] text-right text-muted-foreground mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  {isLastReadByOther && (
                    <div className="text-[10px] text-right text-blue-500 mt-1">
                      ✓ Read
                    </div>
                  )}
                </div>

                {isMe && (
                  <Avatar className="w-9 h-9">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {username?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={endRef} />
      </div>
    </ScrollArea>
  );
}
