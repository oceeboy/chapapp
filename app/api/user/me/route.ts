import { authenticateRequest } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import User from "@/model/User";

export async function GET() {
  await connectToDatabase();

  try {
    const authResult = await authenticateRequest();
    if ("error" in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;

    /* ---------- Fetch the user ---------- */
    const user = await User.findById(userId).select(
      "-password  -__v -conversations"
    ); // ① correct call
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "User fetched", user });
  } catch {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
}
