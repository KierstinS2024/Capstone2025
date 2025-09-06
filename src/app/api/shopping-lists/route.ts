// path: src/app/api/shopping-lists/route.ts
/**
 * Shopping List Main CRUD API
 * POST /api/shopping-lists → Create a new shopping list
 * GET  /api/shopping-lists → Get all shopping lists for the logged-in user
 * JWT-protected via requireAuth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";

connectToDatabase();

export async function POST(req: NextRequest) {
  try {
    const userId = requireAuth(req);

    const { title, items } = await req.json();

    if (!title || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { message: "Title and items (array) are required" },
        { status: 400 }
      );
    }

    const newList = await ShoppingList.create({
      userId,
      title,
      items,
    });

    return NextResponse.json({ data: newList }, { status: 201 });
  } catch (err) {
    console.error("Create Shopping List error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId = requireAuth(req);

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
