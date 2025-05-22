import connectToDatabase from "@/lib/db";
import User from "@/model/User";
import { authenticateRequest } from "@/lib/authMiddleware";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();

  try {
    const authResult = await authenticateRequest();
    if ("error" in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;
    const user = await User.findById(userId)
      .lean()
      .select("-password  -__v -conversations");
    return Response.json({ user });
  } catch {
    return Response.json({ error: "Access token invalid" }, { status: 401 });
  }
}
