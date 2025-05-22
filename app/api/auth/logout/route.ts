import { serialize } from "cookie";

export async function POST() {
  const headers = new Headers();
  headers.append(
    "Set-Cookie",
    serialize("accessToken", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
  );
  headers.append(
    "Set-Cookie",
    serialize("refreshToken", "", {
      httpOnly: true,
      path: "/",
      expires: new Date(0),
    })
  );

  return new Response(JSON.stringify({ message: "Logged out" }), { headers });
}
