// src/lib/serverAuth.ts
import jwt, { Secret } from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET: Secret = process.env.JWT_SECRET!;

// Sign JWT with payload and expiration (TypeScript-safe)
export function signJwt(payload: object, expiresIn = "7d") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresIn as string });
}

// Verify JWT and return payload
export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

// Extract token from cookies
export function getTokenFromRequest(req: NextRequest): string | null {
  return req.cookies.get("token")?.value || null;
}

// Require auth for server-side routes
export function requireAuth(req: NextRequest): string {
  const token = getTokenFromRequest(req);
  if (!token) throw new Error("Unauthorized");
  const payload = verifyJwt(token);
  if (!payload || typeof payload === "string") throw new Error("Unauthorized");
  return (payload as { userId: string }).userId;
}
