// path: src/app/api/shopping-lists/items/[itemId]/route.ts
/**      
 * Shopping List Item CRUD API
 * Handles updating, marking purchased, and deleting individual shopping list items
 * All routes are JWT-protected
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

// Connect to MongoDB
connectToDatabase();

/**
 * PUT /api/shopping-lists/items/[itemId]
 * Update a shopping list item (quantity, unit, purchased status)
 */
export async function PUT(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = verifyToken(token);

    const { quantity, unit, purchased } = await req.json();
    const { itemId } = params;

    if (!itemId) return NextResponse.json({ message: "Item ID required" }, { status: 400 });

    // Find the list containing this item
    const list = await ShoppingList.findOne({ "items._id": itemId, userId });
    if (!list) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    const item = list.items.id(itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    if (quantity !== undefined) item.quantity = quantity;
    if (unit !== undefined) item.unit = unit;
    if (purchased !== undefined) item.purchased = purchased;

    await list.save();

    return NextResponse.json({ data: item });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to update item" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shopping-lists/items/[itemId]
 * Delete a shopping list item
 */
export async function DELETE(req: NextRequest, { params }: { params: { itemId: string } }) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    const userId = verifyToken(token);

    const { itemId } = params;
    if (!itemId) return NextResponse.json({ message: "Item ID required" }, { status: 400 });

    // Find the list containing this item
    const list = await ShoppingList.findOne({ "items._id": itemId, userId });
    if (!list) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    const item = list.items.id(itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    item.remove(); // Remove item from subdocument array
    await list.save();

    return NextResponse.json({ data: { id: itemId, message: "Item deleted" } });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Failed to delete item" },
      { status: 500 }
    );
  }
}
