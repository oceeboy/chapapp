import connectToDatabase from "@/lib/db";
import { authRegisterSchema } from "@/schemas/auth.schema";
import { NextResponse } from "next/server";
import * as bcrypt from "bcrypt";
import User from "@/model/User";
import { signAccessToken, signRefreshToken } from "@/utils/jwt";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const parsed = authRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { email, userName, password } = parsed.data;

    // Check if email or username already exists
    const [emailExists, userNameExists] = await Promise.all([
      User.findOne({ email }),
      User.findOne({ userName }),
    ]);

    if (emailExists) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    if (userNameExists) {
      return NextResponse.json(
        { error: "Username already in use" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 15);

    const newUser = new User({
      email,
      userName,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const accessToken = signAccessToken({
      userId: savedUser._id,
      role: savedUser.role,
    });

    const refreshToken = signRefreshToken({
      userId: savedUser._id,
    });

    const cookieOptions: Parameters<typeof serialize>[2] = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      sameSite: "lax",
    };

    const response = NextResponse.json(
      {
        message: "Registered successfully",
        user: {
          id: savedUser._id,
          email: savedUser.email,
          role: savedUser.role,
          userName: savedUser.userName,
        },
      },
      { status: 200 }
    );

    response.headers.set(
      "Set-Cookie",
      [
        serialize("accessToken", accessToken, {
          ...cookieOptions,
          maxAge: 60 * 60 * 24 * 2, // 2 days
        }),
        serialize("refreshToken", refreshToken, {
          ...cookieOptions,
          maxAge: 60 * 60 * 24 * 7, // 7 days
        }),
      ].join(", ")
    );

    return response;
  } catch (error) {
    console.error("Registration error:", error); // Optional: helpful in dev
    return NextResponse.json({ error: "Failed to register" }, { status: 500 });
  }
}
