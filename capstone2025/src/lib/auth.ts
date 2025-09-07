/** src/lib/auth.ts
 * Authentication utilities
 * - Password hashing with bcrypt
 * - JWT creation and verification
 */

import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import "dotenv/config";

// -----------------------------
// Environment variable check
// -----------------------------
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required.");
}
// Tell TypeScript that from here on, JWT_SECRET is definitely a string
const SECRET: string = JWT_SECRET;

// -----------------------------
// Password Hashing Utilities
// -----------------------------
/**
 * Hash a plain text password
 * @param password - plain text password
 * @returns hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

/**
 * Verify a plain password against a hashed password
 * @param password - plain text password
 * @param hash - hashed password
 * @returns true if match, false otherwise
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// -----------------------------
// JWT Token Utilities
// -----------------------------
/** Token payload structure */
interface TokenPayload {
  userId: string;
}

/**
 * Sign a JWT token with userId payload
 * @param payload - object containing userId
 * @returns signed JWT string valid for 7 days
 */
export function signToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/**
 * Verify a JWT token and extract userId
 * @param token - JWT string
 * @returns userId if valid, otherwise null
 */
export function verifyToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, SECRET) as JwtPayload;
    if (typeof decoded === "object" && decoded.userId) {
      return decoded.userId;
    }
    return null;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}
