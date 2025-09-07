// src/lib/authHelpers.ts
import { NextRequest } from "next/server";
import { verifyToken } from "./auth";

export function requireAuth(req: NextRequest): string {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.replace("Bearer ", "");
  const userId = verifyToken(token);
  if (!userId) throw new Error("Unauthorized");

  return userId;
}
