// /app/api/user/route.ts or /pages/api/user.ts (depending on your setup)

import { authenticateRequest } from "@/lib/authMiddleware";
import connectToDatabase from "@/lib/db";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const authResult = await authenticateRequest();
    if ("error" in authResult) {
      return NextResponse.json({ message: authResult.error }, { status: 401 });
    }

    const { userId } = authResult;

    const currentUser = await User.findById(userId).select("_id role");
    if (!currentUser) {
      return NextResponse.json(
        { message: "Unauthorized: user not found" },
        { status: 403 }
      );
    }

    const searchQuery = req.nextUrl.searchParams.get("q") || "";
    const page = parseInt(req.nextUrl.searchParams.get("page") || "1");
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const filter = searchQuery
      ? {
          userName: {
            $regex: new RegExp(searchQuery, "i"),
          },
        }
      : {};

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -__v -conversations")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to retrieve users" },
      { status: 500 }
    );
  }
}
