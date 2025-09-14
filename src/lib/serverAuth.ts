// path: src/lib/serverAuth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { db } from "@/lib/db";

/**
 * Verifies JWT from request cookies.
 * Returns the user object or null if unauthorized.
 */
export async function verifyAuth(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };
    const user = await db.user.findUnique({ where: { id: decoded.id } });
    return user || null;
  } catch (err) {
    console.error("verifyAuth error:", err);
    return null;
  }
}
