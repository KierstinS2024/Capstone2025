// PATH: src/lib/serverAuth.ts
export const runtime = "nodejs"; // must run in Node

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export interface AuthPayload {
  id: string;
  email: string;
}

export function getUserFromRequest(req: NextRequest): AuthPayload | null {
  const cookie = req.cookies.get("token");
  if (!cookie) return null;

  try {
    return jwt.verify(cookie.value, JWT_SECRET) as AuthPayload;
  } catch (err) {
    console.warn("JWT verification failed:", err);
    return null;
  }
}
