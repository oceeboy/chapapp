import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import Conversation from "@/model/Conversation";
import Message from "@/model/Message";
import User from "@/model/User";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const authResult = await authenticateRequest();

    if ("error" in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;

    // Confirm user exists
    const user = await User.findById(userId).select("_id role");
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: user not found" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const conversationId = segments[segments.length - 1];

    if (!Types.ObjectId.isValid(conversationId)) {
      return NextResponse.json(
        { error: "Invalid conversation ID" },
        { status: 400 }
      );
    }

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate("senderId", "userName _id"); // only populate userName from User model

    const conversation = await Conversation.findById(conversationId).lean();

    return NextResponse.json({
      messages,
      conversation,
      currentUserId: userId,
    });
  } catch (error) {
    console.error("GET /messages error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve messages" },
      { status: 500 }
    );
  }
}
