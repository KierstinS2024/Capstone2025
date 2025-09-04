/** src/lib/auth.ts
 * JWT Authentication Utilities
 * - generateToken: creates JWT
 * - verifyToken: verifies JWT from Authorization header
 */
import jwt from "jsonwebtoken";

const JWT_SECRET: string = process.env.JWT_SECRET || "supersecretkey";

if (!JWT_SECRET) throw new Error("JWT_SECRET must be defined");

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(authHeader: string | null): string {
  if (!authHeader) throw new Error("Authorization header missing");

  const token = authHeader.replace("Bearer ", "");
  if (!token) throw new Error("Token not found");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    throw new Error("Invalid token");
  }
}
