import { ReactNode } from "react";

export default function ConversationLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div>{children}</div>;
}
