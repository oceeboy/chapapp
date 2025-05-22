import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await connectToDatabase();
    const authResult = await authenticateRequest();

    if ("error" in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;

    await User.updateOne({ _id: userId }, { lastSeenAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /status/heartbeat error:", error);
    return NextResponse.json(
      { error: "Failed to update online status" },
      { status: 500 }
    );
  }
}
