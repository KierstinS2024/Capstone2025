// path: src/app/api/shopping-lists/route.ts
/**      
 * Shopping List Main CRUD API
 * 
 * Endpoints:
 *  POST   /api/shopping-lists       → Create a new shopping list
 *  GET    /api/shopping-lists       → Get all shopping lists for the logged-in user
 * 
 * JWT-protected: requires Authorization header with Bearer token
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check for auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Missing Authorization header" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    const { title, items } = await req.json();

    if (!title || !items) {
      return NextResponse.json({ message: "Title and items are required" }, { status: 400 });
    }

    // Create the shopping list
    const newList = await ShoppingList.create({
      userId,
      title,
      items,
    });

    return NextResponse.json({ data: newList });
  } catch (err) {
    console.error("Create Shopping List error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Check for auth token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return NextResponse.json({ message: "Missing Authorization header" }, { status: 401 });

    const token = authHeader.split(" ")[1];
    const userId = verifyToken(token);
    if (!userId) return NextResponse.json({ message: "Invalid token" }, { status: 401 });

    // Get all shopping lists for this user
    const lists = await ShoppingList.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ data: lists });
  } catch (err) {
    console.error("Get Shopping Lists error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
