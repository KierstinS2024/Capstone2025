// path: src/app/api/shopping-lists/items/[itemId]/route.ts
/**
 * Shopping List Item API
 * 
 * Handles operations on individual shopping list items:
 * - PUT: update quantity, unit, or purchased status
 * - DELETE: remove an item from a shopping list
 * 
 * All routes are JWT-protected.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

// Ensure DB connection
connectToDatabase();

/**
 * PUT /api/shopping-lists/items/[itemId]
 * Update a shopping list item's quantity, unit, or purchased status
 */
export async function PUT(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = verifyToken(authHeader);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { itemId } = params;
    if (!itemId) return NextResponse.json({ message: "Item ID is required" }, { status: 400 });

    const updates = await req.json(); // { quantity?, unit?, purchased? }

    // Find the shopping list containing this item for the current user
    const shoppingList = await ShoppingList.findOne({ "items._id": itemId, userId });
    if (!shoppingList) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    const item = shoppingList.items.id(itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    // Apply updates
    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.unit !== undefined) item.unit = updates.unit;
    if (updates.purchased !== undefined) item.purchased = updates.purchased;

    await shoppingList.save();

    return NextResponse.json({ data: item });
  } catch (err) {
    console.error("Error updating shopping list item:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to update item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shopping-lists/items/[itemId]
 * Delete a single item from a shopping list
 */
export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = verifyToken(authHeader);
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { itemId } = params;
    if (!itemId) return NextResponse.json({ message: "Item ID is required" }, { status: 400 });

    // Find the shopping list containing this item for the current user
    const shoppingList = await ShoppingList.findOne({ "items._id": itemId, userId });
    if (!shoppingList) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    const item = shoppingList.items.id(itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    // Remove the item
    item.remove();
    await shoppingList.save();

    return NextResponse.json({ data: { id: itemId, message: "Item deleted successfully" } });
  } catch (err) {
    console.error("Error deleting shopping list item:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to delete item" },
      { status: 500 }
    );
  }
}
