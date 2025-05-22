"use client";
import { MessageContainer } from "@/modules/chat";

import { Suspense } from "react";

export default function Message() {
  return (
    <Suspense fallback={null}>
      <MessageContainer />
    </Suspense>
  );
}
