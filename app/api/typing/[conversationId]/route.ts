import { NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import { TypingStatus } from "@/model/TypingStatus";
import { Types } from "mongoose";

export async function GET(req: Request) {
  await connectToDatabase();

  const auth = await authenticateRequest();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  const { userId } = auth;

  const url = new URL(req.url);
  const segments = url.pathname.split("/");
  const conversationId = segments[segments.length - 1];

  if (!Types.ObjectId.isValid(conversationId)) {
    return NextResponse.json(
      { error: "Invalid conversation ID" },
      { status: 400 }
    );
  }

  // Check if the *other user* in this 1-on-1 chat is typing (within last 7s)
  const otherTyping = await TypingStatus.findOne({
    conversationId,
    userId: { $ne: userId },
    lastTypedAt: { $gte: new Date(Date.now() - 7000) },
  }).populate("userId", "userName");

  if (otherTyping && otherTyping.userId?.userName) {
    return NextResponse.json({ typingUser: otherTyping.userId.userName });
  }

  return NextResponse.json({ typingUser: null });
}
