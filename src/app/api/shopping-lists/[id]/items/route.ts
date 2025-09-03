// path: src/app/api/shopping-lists/[id]/items/route.ts
/**
 * Shopping List Items API (Collection)
 * 
 * Handles operations on items within a specific shopping list:
 * - POST: add a new item to a shopping list
 * 
 * JWT-protected: requires Authorization header with Bearer token
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

// Ensure DB connection
connectToDatabase();

/**
 * POST /api/shopping-lists/:id/items
 * Add a new item to an existing shopping list
 */
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = verifyToken(authHeader);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id: listId } = params;
    if (!listId) return NextResponse.json({ message: "Shopping list ID is required" }, { status: 400 });

    const { ingredientId, quantity, unit } = await req.json();
    if (!ingredientId || quantity === undefined || !unit) {
      return NextResponse.json({ message: "ingredientId, quantity, and unit are required" }, { status: 400 });
    }

    // Find the shopping list for the current user
    const shoppingList = await ShoppingList.findOne({ _id: listId, userId });
    if (!shoppingList) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });

    const newItem = { ingredientId, quantity, unit, purchased: false };
    shoppingList.items.push(newItem);
    await shoppingList.save();

    return NextResponse.json({ data: newItem }, { status: 201 });
  } catch (err) {
    console.error("Error adding item to shopping list:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to add item" },
      { status: 500 }
    );
  }
}
