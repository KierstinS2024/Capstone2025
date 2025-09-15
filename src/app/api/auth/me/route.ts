// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest, verifyJwt } from "@/lib/serverAuth";
import { connectDb } from "@/lib/db";
import User from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ user: null });

    const payload = verifyJwt(token);
    if (!payload || typeof payload === "string")
      return NextResponse.json({ user: null });

    const userId = (payload as { userId: string }).userId;

    await connectDb();
    const user = await User.findById(userId);
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { email: user.email, id: user._id } });
  } catch {
    return NextResponse.json({ user: null });
  }
}
