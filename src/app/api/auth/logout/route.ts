// src/app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set({
    name: "session",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0, // expire immediately
  });

  return response;
}
