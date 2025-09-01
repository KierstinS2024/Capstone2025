// path: src/app/api/shopping-lists/items/[itemId]/route.ts
/** 
 * Shopping List Item CRUD
 *
 * PATCH: Update a single shopping list item (quantity, unit, purchased)
 * DELETE: Remove a shopping list item from its parent shopping list
 *
 * All operations require JWT authentication.
 * Ownership of the parent shopping list is verified before making changes.
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ShoppingList from "@/models/ShoppingList";

interface Params {
  params: { itemId: string };
}

/**
 * PATCH: Update a shopping list item
 * Example: Update quantity, unit, or purchased status
 */
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    // Parse the request body for updated fields
    const { quantity, unit, purchased } = await req.json();

    await connectToDatabase();

    // Find the shopping list that contains this item and belongs to the user
    const shoppingList = await ShoppingList.findOne({
      userId,
      "items._id": params.itemId,
    });

    if (!shoppingList) {
      return NextResponse.json({ message: "Shopping list item not found" }, { status: 404 });
    }

    // Find the specific item
    const item = shoppingList.items.id(params.itemId);
    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    // Update fields if provided
    if (quantity !== undefined) item.quantity = quantity;
    if (unit) item.unit = unit;
    if (purchased !== undefined) item.purchased = purchased;

    await shoppingList.save();

    return NextResponse.json({ item, shoppingList });
  } catch (error) {
    console.error("Error updating shopping list item:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE: Remove a shopping list item from its parent list
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);

    await connectToDatabase();

    // Find the shopping list that contains this item and belongs to the user
    const shoppingList = await ShoppingList.findOne({
      userId,
      "items._id": params.itemId,
    });

    if (!shoppingList) {
      return NextResponse.json({ message: "Shopping list item not found" }, { status: 404 });
    }

    // Remove the item
    shoppingList.items.id(params.itemId)?.remove();

    await shoppingList.save();

    return NextResponse.json({ message: "Item removed successfully", shoppingList });
  } catch (error) {
    console.error("Error deleting shopping list item:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
