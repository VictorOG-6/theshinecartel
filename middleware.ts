import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/types";
import {
  areAuthTokensExpired,
  clearSessionCookies,
  resolveLocalAuthSession,
} from "@/lib/server-auth";

const ADMIN_ROLES = new Set<UserRole>(["admin", "staff"]);

const redirectToSignIn = (request: NextRequest, clearCookies = false) => {
  const response = NextResponse.redirect(new URL("/sign-in", request.url));

  if (clearCookies) {
    clearSessionCookies(response);
  }

  return response;
};

export async function middleware(request: NextRequest) {
  const cookies = {
    access_token: request.cookies.get("access_token")?.value,
    refresh_token: request.cookies.get("refresh_token")?.value,
    user_role: request.cookies.get("user_role")?.value,
  };

  const session = resolveLocalAuthSession(cookies);

  if (!session.user) {
    return redirectToSignIn(request, areAuthTokensExpired(cookies));
  }

  if (!ADMIN_ROLES.has(session.user.role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
