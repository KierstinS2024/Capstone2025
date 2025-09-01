// src/lib/auth.ts
import jwt from "jsonwebtoken";

// Read the JWT secret key from environment variables
const secretEnv = process.env.JWT_SECRET;
if (!secretEnv) {
  throw new Error("JWT_SECRET must be defined in .env.local");
}
const secret: string = secretEnv;

/**
 * Create a JWT for a given user ID
 * Expires in 7 days
 */
export function createToken(userId: string): string {
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
}

/**
 * Verify a JWT from the Authorization header
 * Returns userId if valid, otherwise null
 */
export function verifyToken(authHeader?: string): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}
