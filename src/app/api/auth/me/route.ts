// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ user: null }, { status: 200 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    await connectToDB();
    const user = await User.findById(decoded.id);

    if (!user) return NextResponse.json({ user: null }, { status: 200 });

    return NextResponse.json({
      user: { id: user._id.toString(), email: user.email },
    });
  } catch (err) {
    console.error("Get user error:", err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
