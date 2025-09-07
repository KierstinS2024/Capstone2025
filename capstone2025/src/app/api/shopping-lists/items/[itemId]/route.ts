// path: src/app/api/shopping-lists/items/[itemId]/route.ts
/**
 * Shopping List Item API
 * - PUT    /api/shopping-lists/items/:itemId → Update an item (quantity, unit, purchased)
 * - DELETE /api/shopping-lists/items/:itemId → Remove an item from a shopping list
 *
 * Features:
 * 1. JWT-protected using verifyToken
 * 2. Type-safe request and response
 * 3. Clear error handling
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

export interface ShoppingListItemUpdate {
  quantity?: number;
  unit?: string;
  purchased?: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

await connectToDatabase();

// -----------------------------
// PUT /shopping-lists/items/:itemId
// Update a shopping list item's quantity, unit, or purchased status
// -----------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = authHeader
      ? verifyToken(authHeader.replace("Bearer ", ""))
      : null;
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { itemId } = params;
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid item ID" },
        { status: 400 }
      );
    }

    const updates: ShoppingListItemUpdate = await req.json();

    // Find the shopping list that contains the item
    const shoppingList = await ShoppingList.findOne({
      "items._id": itemId,
      userId,
    });
    if (!shoppingList)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    const item = shoppingList.items.id(itemId);
    if (!item)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    // Apply updates
    if (updates.quantity !== undefined) item.quantity = updates.quantity;
    if (updates.unit !== undefined) item.unit = updates.unit;
    if (updates.purchased !== undefined) item.purchased = updates.purchased;

    await shoppingList.save();

    return NextResponse.json<ApiResponse<typeof item>>({
      success: true,
      message: "Item updated successfully",
      data: item,
    });
  } catch (err) {
    console.error("PUT /shopping-lists/items/:itemId error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}

// -----------------------------
// DELETE /shopping-lists/items/:itemId
// Remove a single item from a shopping list
// -----------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } }
) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = authHeader
      ? verifyToken(authHeader.replace("Bearer ", ""))
      : null;
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { itemId } = params;
    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid item ID" },
        { status: 400 }
      );
    }

    const shoppingList = await ShoppingList.findOne({
      "items._id": itemId,
      userId,
    });
    if (!shoppingList)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    const item = shoppingList.items.id(itemId);
    if (!item)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Item not found" },
        { status: 404 }
      );

    item.remove();
    await shoppingList.save();

    return NextResponse.json<ApiResponse<{ id: string }>>({
      success: true,
      message: "Item deleted successfully",
      data: { id: itemId },
    });
  } catch (err) {
    console.error("DELETE /shopping-lists/items/:itemId error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
