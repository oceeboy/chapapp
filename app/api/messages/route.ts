import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import Message from "@/model/Message";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const authResult = await authenticateRequest();
    if ("error" in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;

    // Validate user exists
    const user = await User.findById(userId).select("_id role");
    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: user not found" },
        { status: 403 }
      );
    }

    const messages = await Message.find().sort({
      createdAt: 1,
    });

    return NextResponse.json(messages);
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve messages" },
      { status: 500 }
    );
  }
}
