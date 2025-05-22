"use client";

import { ConversationList } from "../ui/conversation-list";

export function ConversationContainer() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-hidden">
        <ConversationList />
      </div>
    </div>
  );
}
