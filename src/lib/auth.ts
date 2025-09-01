// path: src/lib/auth.ts
/**
 * JWT Authentication Utilities
 *
 * Provides helper functions for creating and verifying JWTs.
 * Used by API routes to authenticate users and protect endpoints.
 */

import jwt from "jsonwebtoken";

// Ensure JWT_SECRET is defined, or throw immediately
const JWT_SECRET: string = process.env.JWT_SECRET!;
if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined in environment variables");

/**
 * Generate a JWT token for a given user ID
 * @param userId - MongoDB _id of the user
 * @returns JWT token string
 */
export function generateToken(userId: string): string {
  // TypeScript now knows JWT_SECRET is a string
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify a JWT token from Authorization header
 * @param authHeader - "Bearer <token>"
 * @returns userId string if valid
 * @throws Error if token is missing or invalid
 */
export function verifyToken(authHeader: string | null): string {
  if (!authHeader) throw new Error("Authorization header missing");

  const token = authHeader.replace("Bearer ", "");
  if (!token) throw new Error("Token not found");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (err) {
    throw new Error("Invalid token");
  }
}
