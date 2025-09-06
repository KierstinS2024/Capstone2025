/** src/lib/auth.ts
 * requireAuth.ts
 * Helper to enforce JWT authentication for Next.js API routes
 */

// JWT utility functions
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

/**
 * Generate a JWT for a user
 */
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

/**
 * Verify a JWT and return the userId if valid
 */
export function verifyToken(token: string | undefined | null): string | null {
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}
