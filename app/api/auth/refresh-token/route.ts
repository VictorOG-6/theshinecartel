// app/api/auth/refresh-token/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@/types";
import {
  clearSessionCookies,
  fetchUserRole,
  parseUserRole,
  setSessionCookies,
  USER_ROLE_COOKIE,
} from "@/lib/server-auth";

interface DecodedToken {
  exp: number;
  user_id: string;
  sub: string;
  jti: string;
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

async function resolveRole(
  accessToken: string,
  existingRole?: string,
): Promise<UserRole | null> {
  const parsedRole = parseUserRole(existingRole);
  if (parsedRole) {
    return parsedRole;
  }

  return fetchUserRole(accessToken);
}

/**
 * POST /api/auth/refresh-token
 * Refreshes the access token using the refresh token
 * Calls your FastAPI /auth/refresh endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refresh_token");

    if (!refreshTokenCookie?.value) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 },
      );
    }

    const refreshToken = refreshTokenCookie.value;

    try {
      const decoded = jwtDecode<DecodedToken>(refreshToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp <= currentTime) {
        const response = NextResponse.json(
          { error: "Refresh token expired" },
          { status: 401 },
        );
        clearSessionCookies(response);
        return response;
      }
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const backendResponse = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));

      const response = NextResponse.json(
        { error: errorData.detail || "Token refresh failed" },
        { status: backendResponse.status },
      );
      clearSessionCookies(response);
      return response;
    }

    const data: RefreshTokenResponse = await backendResponse.json();
    jwtDecode<DecodedToken>(data.access_token);
    jwtDecode<DecodedToken>(data.refresh_token);

    const role = await resolveRole(
      data.access_token,
      cookieStore.get(USER_ROLE_COOKIE)?.value,
    );

    if (!role) {
      const response = NextResponse.json(
        { error: "Unable to resolve user role" },
        { status: 401 },
      );
      clearSessionCookies(response);
      return response;
    }

    const response = NextResponse.json({
      success: true,
      access_token: data.access_token,
      token_type: data.token_type,
    });
    setSessionCookies(response, {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      role,
    });

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);

    const response = NextResponse.json(
      { error: "Failed to refresh token" },
      { status: 500 },
    );
    clearSessionCookies(response);
    return response;
  }
}

/**
 * GET /api/auth/refresh-token
 * Check if refresh token exists and is valid
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get("refresh_token");

    if (!refreshToken?.value) {
      return NextResponse.json(
        { valid: false, message: "No refresh token found" },
        { status: 401 },
      );
    }

    try {
      const decoded = jwtDecode<DecodedToken>(refreshToken.value);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp <= currentTime) {
        return NextResponse.json(
          { valid: false, message: "Refresh token expired" },
          { status: 401 },
        );
      }

      return NextResponse.json({
        valid: true,
        expiresAt: decoded.exp,
      });
    } catch (error) {
      return NextResponse.json(
        { valid: false, message: "Invalid refresh token" },
        { status: 401 },
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check refresh token" },
      { status: 500 },
    );
  }
}
