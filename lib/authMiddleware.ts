import { cookies } from "next/headers";
import { verifyAccessToken } from "@/utils/jwt";

export async function authenticateRequest() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("accessToken")?.value;

  if (!token) return { error: "Unauthorized: No access token" };

  try {
    const payload = verifyAccessToken(token) as {
      userId: string;
      role: string;
    };

    return payload;
  } catch {
    return { error: "Unauthorized: Invalid or expired token" };
  }
}
