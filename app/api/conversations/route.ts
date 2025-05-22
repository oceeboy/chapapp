import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import Conversation from "@/model/Conversation";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const authResult = await authenticateRequest();

    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;
    const { participantId } = await req.json();

    if (!userId || !participantId) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    if (!Types.ObjectId.isValid(participantId)) {
      return NextResponse.json(
        { error: "Invalid participant ID" },
        { status: 400 }
      );
    }

    if (userId === participantId) {
      return NextResponse.json(
        { error: "Cannot create conversation with yourself" },
        { status: 400 }
      );
    }

    const participantIds = [userId, participantId];

    let conversation = await Conversation.findOne({
      participants: { $size: 2, $all: participantIds },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: participantIds,
        readStatus: participantIds.map((id) => ({ userId: id })),
      });
    }

    return NextResponse.json({ message: "conversation started", conversation });
  } catch {
    return NextResponse.json(
      { error: "An error occurred while creating/fetching the conversation." },
      { status: 500 }
    );
  }
}
