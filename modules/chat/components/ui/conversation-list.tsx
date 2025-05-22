"use client";

import { useConversations, useMe } from "../../hooks";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquareIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export function ConversationList() {
  const { data: session } = useMe();
  const currentUserId = session?._id;
  const { data, isLoading } = useConversations();
  const router = useRouter();

  const handleClick = (conversationId: string) => {
    router.push(`/conversations/message?conversationId=${conversationId}`);
  };

  if (isLoading) {
    return (
      <div className="space-y-4 px-4 py-6">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground">
        <MessageSquareIcon className="w-8 h-8 mb-2 opacity-30" />
        <p>No conversations yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-100px)] px-4 py-6">
      <div className="space-y-4">
        {data.map((c) => {
          const otherParticipants = c.participants.filter(
            (p) => p._id !== currentUserId
          );
          const displayName = otherParticipants
            .map((p) => p.userName)
            .join(" & ");
          const avatarLetter =
            otherParticipants[0]?.userName?.charAt(0).toUpperCase() || "?";

          return (
            <Card
              key={c._id}
              onClick={() => handleClick(c._id)}
              className="cursor-pointer hover:bg-muted transition-all duration-150 border shadow-sm rounded-xl"
            >
              <CardContent className="flex items-center gap-4 p-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{avatarLetter}</AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <p className="text-sm font-semibold">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Last updated:{" "}
                    {new Date(c.updatedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
