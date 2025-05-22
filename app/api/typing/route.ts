import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { TypingStatus } from "@/model/TypingStatus";
import { authenticateRequest } from "@/lib/authMiddleware";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResult = await authenticateRequest();
    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;
    const { conversationId } = await req.json();

    if (!conversationId) {
      return NextResponse.json(
        { error: "Missing conversationId" },
        { status: 400 }
      );
    }

    const typeStatus = await TypingStatus.findOneAndUpdate(
      { userId, conversationId },
      { lastTypedAt: new Date() },
      { upsert: true, new: true }
    );

    return NextResponse.json({ typeStatus, status: "ok" });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while updating typing status." },
      { status: 500 }
    );
  }
}
