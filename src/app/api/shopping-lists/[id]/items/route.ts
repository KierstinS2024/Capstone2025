// path: src/app/api/shopping-lists/[id]/items/route.ts
/**
 * Add a new item to a shopping list
 * POST /api/shopping-lists/:id/items
 * JWT required
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id: listId } = params;
    const { ingredientId, quantity, unit } = await req.json();
    if (!ingredientId || quantity === undefined || !unit) {
      return NextResponse.json(
        { message: "ingredientId, quantity, and unit are required" },
        { status: 400 }
      );
    }

    const shoppingList = await ShoppingList.findOne({ _id: listId, userId });
    if (!shoppingList)
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );

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
