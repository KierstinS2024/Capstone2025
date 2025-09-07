// path: src/app/api/shopping-lists/[id]/items/route.ts
/**
 * Shopping List Items API
 *
 * Handles operations on individual items within a shopping list:
 *  - POST   → Add a new item
 *  - PUT    → Update quantity, unit, or purchased status
 *  - DELETE → Remove an item
 *
 * All routes are JWT-protected via requireAuth
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";
import { ApiResponse } from "@/types/api";

// -----------------------------
// Helpers
// -----------------------------
async function validateObjectId(id: string) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid ID format");
  }
}

// -----------------------------
// POST /api/shopping-lists/:id/items
// Add a new item to a shopping list
// -----------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id: listId } = params;
    await validateObjectId(listId);

    const body: { ingredientId: string; quantity: number; unit: string } =
      await req.json();

    if (!body.ingredientId || body.quantity === undefined || !body.unit) {
      return NextResponse.json<ApiResponse<null>>(
        { message: "ingredientId, quantity, and unit are required" },
        { status: 400 }
      );
    }

    const shoppingList = await ShoppingList.findOne({ _id: listId, userId });
    if (!shoppingList) {
      return NextResponse.json<ApiResponse<null>>(
        { message: "Shopping list not found" },
        { status: 404 }
      );
    }

    const newItem = {
      ingredientId: body.ingredientId,
      quantity: body.quantity,
      unit: body.unit,
      purchased: false,
    };

    shoppingList.items.push(newItem);
    await shoppingList.save();

    return NextResponse.json<ApiResponse<typeof newItem>>(
      { message: "Item added", data: newItem },
      { status: 201 }
    );
  } catch (err: unknown) {
    console.error("POST shopping list item error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// -----------------------------
// PUT /api/shopping-lists/:id/items/:itemId
// Update an existing shopping list item
// -----------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id, itemId } = params;
    await validateObjectId(id);
    await validateObjectId(itemId);

    const updates: Partial<{
      quantity: number;
      unit: string;
      purchased: boolean;
    }> = await req.json();

    const shoppingList = await ShoppingList.findOne({ _id: id, userId });
    if (!shoppingList) {
      return NextResponse.json<ApiResponse<null>>(
        { message: "Shopping list not found" },
        { status: 404 }
      );
    }

    const item = shoppingList.items.id(itemId);
    if (!item) {
      return NextResponse.json<ApiResponse<null>>(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.unit !== undefined) item.unit = updates.unit;
    if (updates.purchased !== undefined) item.purchased = updates.purchased;

    await shoppingList.save();

    return NextResponse.json<ApiResponse<typeof item>>(
      { message: "Item updated", data: item },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("PUT shopping list item error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}

// -----------------------------
// DELETE /api/shopping-lists/:id/items/:itemId
// Remove an item from a shopping list
// -----------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; itemId: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const { id, itemId } = params;
    await validateObjectId(id);
    await validateObjectId(itemId);

    const shoppingList = await ShoppingList.findOne({ _id: id, userId });
    if (!shoppingList) {
      return NextResponse.json<ApiResponse<null>>(
        { message: "Shopping list not found" },
        { status: 404 }
      );
    }

    const item = shoppingList.items.id(itemId);
    if (!item) {
      return NextResponse.json<ApiResponse<null>>(
        { message: "Item not found" },
        { status: 404 }
      );
    }

    item.remove();
    await shoppingList.save();

    return NextResponse.json<ApiResponse<{ id: string }>>(
      { message: "Item deleted", data: { id: itemId } },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("DELETE shopping list item error:", err);
    return NextResponse.json<ApiResponse<null>>(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
