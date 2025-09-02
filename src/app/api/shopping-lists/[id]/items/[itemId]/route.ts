// path: src/app/api/shopping-lists/[id]/items/[itemId]/route.ts
/**
 * Shopping List Item API
 * Handles operations on individual shopping list items:
 * - PUT: update item details (quantity, unit, purchased status)
 * - DELETE: remove an item from the shopping list
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

/**
 * PUT /api/shopping-lists/:id/items/:itemId
 * Update a single shopping list item
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    await connectToDatabase();

    // Verify JWT token
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const userId = token && (await verifyToken(token));
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const updates = await req.json(); // { quantity?, unit?, purchased? }

    // Find the shopping list and update the specific item
    const shoppingList = await ShoppingList.findOne({ _id: params.id, userId });
    if (!shoppingList) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });

    const item = shoppingList.items.id(params.itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    // Apply updates
    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.unit !== undefined) item.unit = updates.unit;
    if (updates.purchased !== undefined) item.purchased = updates.purchased;

    await shoppingList.save();

    return NextResponse.json({ message: "Item updated", item });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/shopping-lists/:id/items/:itemId
 * Remove a single item from a shopping list
 */
export async function DELETE(req: NextRequest, { params }: { params: { id: string; itemId: string } }) {
  try {
    await connectToDatabase();

    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const userId = token && (await verifyToken(token));
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const shoppingList = await ShoppingList.findOne({ _id: params.id, userId });
    if (!shoppingList) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });

    const item = shoppingList.items.id(params.itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    item.remove(); // remove the item
    await shoppingList.save();

    return NextResponse.json({ message: "Item deleted" });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
