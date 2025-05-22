import connectToDatabase from "@/lib/db";
import User from "@/model/User";
import { authLoginSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import { signAccessToken, signRefreshToken, TokenPayload } from "@/utils/jwt";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const parsed = authLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { password, email } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      role: user.role,
    };
    // Generate tokens
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax" as const,
    };
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          userName: user.userName,
        },
      },
      { status: 200 }
    );
    response.headers.set(
      "Set-Cookie",
      [
        serialize("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 60 * 15, // 15 minutes // 2 days
        }),
        serialize("refreshToken", refreshToken, {
          ...cookieOptions,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }),
      ].join(", ")
    );

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
