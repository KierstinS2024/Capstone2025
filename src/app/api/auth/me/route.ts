// PATH: src/app/api/auth/me/route.ts
export const runtime = "nodejs"; // ensure Node

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getUserFromRequest } from "@/lib/serverAuth";

export async function GET(req: NextRequest) {
  await connectDB();

  const payload = getUserFromRequest(req);
  if (!payload) return NextResponse.json(null, { status: 401 });

  const user = await User.findById(payload.id).select("-password");
  if (!user) return NextResponse.json(null, { status: 404 });

  return NextResponse.json(user);
}
