"use client";
import { HeaderBox } from "@/components/shared";

import { UserList } from "../ui/user-list";

export function ChatContainer() {
  return (
    <div className="w-full flex justify-between">
      <div>
        <HeaderBox title="Find User" />

        <UserList />
      </div>
    </div>
  );
}
