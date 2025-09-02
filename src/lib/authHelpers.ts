// path: src/lib/authHelpers.ts
/**
 * Helper functions for authentication / JWT extraction
 */

import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

/**
 * Safely extracts a JWT token from the Authorization header.
 * Returns null if missing or malformed.
 */
export function getTokenFromHeader(req: NextRequest): string | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}

/**
 * Safely verifies a JWT token.
 * Throws an error if token is missing or invalid.
 */
export function getUserIdFromRequest(req: NextRequest): string {
  const token = getTokenFromHeader(req);
  if (!token) throw new Error("Missing or invalid token");
  const userId = verifyToken(token); // assumes verifyToken throws if invalid
  return userId;
}
