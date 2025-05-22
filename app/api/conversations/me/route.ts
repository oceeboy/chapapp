import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import Conversation from "@/model/Conversation";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const authResult = await authenticateRequest();

    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "userName", // Only return userName
      })
      .select("-__v")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("GET /conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations." },
      { status: 500 }
    );
  }
}
