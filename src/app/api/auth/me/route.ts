// Path: src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserFromReq } from "@/lib/authHelpers";

export async function GET(req: NextRequest) {
  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({
      id: user._id,
      email: user.email,
      name: user.name,
    });
  } catch (err) {
    console.error("Auth Me Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
