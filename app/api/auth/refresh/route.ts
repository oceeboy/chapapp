import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "@/utils/jwt";
import { serialize } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = cookies();
  const refreshToken = (await cookieStore).get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "Missing refresh token" },
      { status: 401 }
    );
  }

  try {
    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken({ userId: payload.userId });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };

    const headers = new Headers();
    headers.append(
      "Set-Cookie",
      serialize("accessToken", newAccessToken, {
        ...cookieOptions,
        maxAge: 60 * 15, // 15 minutes // 2 days
      })
    );
    headers.append(
      "Set-Cookie",
      serialize("refreshToken", newRefreshToken, {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 7,
      })
    );

    return NextResponse.json(
      { message: "Token refreshed" },
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Refresh token error:", err);
    return new Response(JSON.stringify({ error: "Invalid refresh token" }), {
      status: 403,
    });
  }
}
