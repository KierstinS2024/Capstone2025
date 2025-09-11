// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { User } from "@/models/User";
import { Types } from "mongoose";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const cookie = req.headers.get("cookie") || "";
    const match = cookie.match(/session=([a-f0-9]+)/);
    const userId = match?.[1];
    if (!userId) return NextResponse.json(null, { status: 200 });

    const userDoc = await User.findById(userId);
    if (!userDoc) return NextResponse.json(null, { status: 200 });

    return NextResponse.json({
      _id: userDoc._id.toString(),
      name: userDoc.name,
      email: userDoc.email,
      favorites: (userDoc.favorites as Types.ObjectId[]).map(
        (f: Types.ObjectId) => f.toString()
      ),
    });
  } catch (err: any) {
    console.error("Fetch current user error:", err);
    return NextResponse.json(null, { status: 500 });
  }
}
