// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@/types";
import {
  clearSessionCookies,
  fetchUserRole,
  parseUserRole,
  setSessionCookies,
} from "@/lib/server-auth";

interface DecodedToken {
  exp: number;
  user_id: string;
  sub: string;
}

async function resolveRole(
  accessToken: string,
  role?: string,
): Promise<UserRole | null> {
  const parsedRole = parseUserRole(role);
  if (parsedRole) {
    return parsedRole;
  }

  return fetchUserRole(accessToken);
}

export async function POST(request: NextRequest) {
  try {
    const { accessToken, refreshToken, role } = await request.json();

    if (!accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Tokens are required" },
        { status: 400 },
      );
    }

    jwtDecode<DecodedToken>(accessToken);
    jwtDecode<DecodedToken>(refreshToken);

    const resolvedRole = await resolveRole(accessToken, role);
    if (!resolvedRole) {
      return NextResponse.json(
        { error: "Unable to resolve user role" },
        { status: 400 },
      );
    }

    const response = NextResponse.json({ success: true });
    setSessionCookies(response, {
      accessToken,
      refreshToken,
      role: resolvedRole,
    });

    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Failed to create session" },
      { status: 500 },
    );
  }
}

// DELETE route for logout
export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    clearSessionCookies(response);
    return response;
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete session" },
      { status: 500 },
    );
  }
}
