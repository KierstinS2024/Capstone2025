/**
 * src/lib/authHelpers.ts
 * Helpers for Next.js API route JWT authentication
 */

import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

// -----------------------------
// Extract token from Authorization header
// -----------------------------
export function getTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;

  // Expect "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;

  return parts[1];
}

// -----------------------------
// Require Auth in API routes
// -----------------------------
export function requireAuth(req: NextRequest): string {
  const token = getTokenFromHeader(req);
  if (!token) throw new Error("Unauthorized: no token provided");

  const userId = verifyToken(token);
  if (!userId) throw new Error("Unauthorized: invalid token");

  return userId;
}
