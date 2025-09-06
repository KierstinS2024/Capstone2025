// path: src/app/api/shopping-lists/[id]/items/[itemId]/route.ts
/**
 * Shopping List Item API
 * PUT    /api/shopping-lists/:id/items/:itemId → Update item (quantity, unit, purchased)
 * DELETE /api/shopping-lists/:id/items/:itemId → Remove item
 * JWT-protected via requireAuth
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";

connectToDatabase();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const userId = requireAuth(req);

    const { id, itemId } = params;
    if (!id || !itemId)
      return NextResponse.json(
        { message: "Shopping list ID and item ID are required" },
        { status: 400 }
      );

    const updates = await req.json();

    const shoppingList = await ShoppingList.findOne({ _id: id, userId });
    if (!shoppingList)
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );

    const item = shoppingList.items.id(itemId);
    if (!item)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.unit !== undefined) item.unit = updates.unit;
    if (updates.purchased !== undefined) item.purchased = updates.purchased;

    await shoppingList.save();

    return NextResponse.json({ message: "Item updated", item });
  } catch (err) {
    console.error("Error updating shopping list item:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    const userId = requireAuth(req);

    const { id, itemId } = params;
    if (!id || !itemId)
      return NextResponse.json(
        { message: "Shopping list ID and item ID are required" },
        { status: 400 }
      );

    const shoppingList = await ShoppingList.findOne({ _id: id, userId });
    if (!shoppingList)
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );

    const item = shoppingList.items.id(itemId);
    if (!item)
      return NextResponse.json({ message: "Item not found" }, { status: 404 });

    item.remove();
    await shoppingList.save();

    return NextResponse.json({ message: "Item deleted" });
  } catch (err) {
    console.error("Error deleting shopping list item:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
