// path: src/lib/authHelpers.ts
/**
 * Helper functions for authentication / JWT extraction
 */

import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

/**
 * Extract token from Authorization header
 */
export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  const [type, token] = authHeader.split(" ");
  return type === "Bearer" ? token : null;
}

/**
 * Get userId from request or return null
 */
export function getUserIdFromRequest(req: NextRequest): string | null {
  const token = getTokenFromRequest(req);
  return verifyToken(token);
}

/**
 * Middleware helper for protected routes
 * Returns userId if authorized, otherwise throws NextResponse 401
 */
import { NextResponse } from "next/server";

export function requireAuth(req: NextRequest): string {
  const userId = getUserIdFromRequest(req);
  if (!userId)
    throw NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  return userId;
}
