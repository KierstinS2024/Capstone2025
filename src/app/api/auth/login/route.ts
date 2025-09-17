// PATH: src/app/api/auth/login/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { setTokenCookie } from "@/lib/cookieUtils";

const JWT_SECRET = process.env.JWT_SECRET || "";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, {
    expiresIn: "7d",
  });
  const res = NextResponse.json({ id: user._id, email: user.email });
  setTokenCookie(res, token);
  return res;
}
