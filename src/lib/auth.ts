// path: src/lib/auth.ts
/**
 * Authentication helpers
 * - verifyToken: validates JWT and returns userId
 * - can be extended with middleware for protected routes
 */
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

/**
 * Verifies JWT token and returns the userId
 * @param tokenString string | null from Authorization header
 * @returns userId as string
 */
export function verifyToken(tokenString: string | null): string {
  if (!tokenString) throw new Error("Missing Authorization header");

  // Expect header format: "Bearer <token>"
  const token = tokenString.split(" ")[1];
  if (!token) throw new Error("Invalid token format");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
}
