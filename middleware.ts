import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/", "/login", "/register"];

const roleProtectedRoutes = [
  { prefix: "/admin", allowedRoles: ["admin"] },
  { prefix: "/account", allowedRoles: ["user", "admin"] },
];

const REQUIRED_VERSION = process.env.AUTH_VERSION as string; // Auth version check

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("accessToken");

  // No token? Redirect to login
  if (!accessToken) {
    return redirectToLogin(req);
  }

  const tokenPayload = parseJwt(accessToken.value);

  // Invalid token (e.g., expired, malformed, wrong version)? Clear and redirect
  if (
    !tokenPayload ||
    !tokenPayload.userId ||
    !tokenPayload.role ||
    tokenPayload.version !== REQUIRED_VERSION
  ) {
    return redirectToLogin(req, true); // Clear token
  }

  // Role-based route protection
  for (const route of roleProtectedRoutes) {
    if (pathname.startsWith(route.prefix)) {
      if (!route.allowedRoles.includes(tokenPayload.role)) {
        const unauthorizedUrl = req.nextUrl.clone();
        unauthorizedUrl.pathname = "/unauthorized";
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  // All checks passed
  return NextResponse.next();
}

// Redirect helper
function redirectToLogin(req: NextRequest, clearToken = false) {
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/login";
  const res = NextResponse.redirect(loginUrl);

  if (clearToken) {
    res.cookies.set("accessToken", "", {
      maxAge: 0,
      path: "/",
      httpOnly: true,
    });
  }

  return res;
}

// Safe JWT decode function
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );

    const currentTime = Math.floor(Date.now() / 1000);
    if (jsonPayload.exp && currentTime > jsonPayload.exp) {
      return null; // Token expired
    }

    return jsonPayload;
  } catch {
    return null; // Invalid token
  }
}

// Routes protected by middleware
export const config = {
  matcher: ["/chat/:path*", "/conversations/:path*"],
};
