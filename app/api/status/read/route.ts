import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import Conversation from "@/model/Conversation";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const authResult = await authenticateRequest();

    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;
    const { conversationId, lastReadMessageId } = await req.json();

    if (!conversationId || !lastReadMessageId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    await Conversation.updateOne(
      { _id: conversationId, "readStatus.userId": userId },
      {
        $set: {
          "readStatus.$.lastReadAt": new Date(),
          "readStatus.$.lastReadMessageId": lastReadMessageId,
        },
      }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /status/read error:", error);
    return NextResponse.json(
      { error: "Failed to update read status" },
      { status: 500 }
    );
  }
}
