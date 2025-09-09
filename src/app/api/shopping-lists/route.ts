// File: src/app/api/shopping-lists/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

await connectToDatabase();

// Helper to get userId from request
async function getUserIdFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  return verifyToken(token);
}

// POST /shopping-lists - create new list
export async function POST(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title, items } = await req.json();
    if (!title || !items) {
      return NextResponse.json(
        { message: "Title and items are required" },
        { status: 400 }
      );
    }

    const newList = await ShoppingList.create({ userId, title, items });
    return NextResponse.json({ data: newList }, { status: 201 });
  } catch (err) {
    console.error("Create Shopping List error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// GET /shopping-lists - list all user's shopping lists
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const lists = await ShoppingList.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ data: lists });
  } catch (err) {
    console.error("Get Shopping Lists error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
