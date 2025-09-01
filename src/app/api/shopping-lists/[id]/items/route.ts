// path: src/app/api/shopping-lists/[id]/items/route.ts
/** 
 * Add Item to Shopping List
 *
 * POST: Add a new item to an existing shopping list
 *
 * Requirements:
 * - JWT authentication
 * - Only the shopping list owner can add items
 * - Items include ingredientId, quantity, unit, and optional purchased status
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ShoppingList from "@/models/ShoppingList";

interface Params {
  params: { id: string };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader); // Validate JWT

    const { ingredientId, quantity, unit, purchased } = await req.json();

    if (!ingredientId || quantity === undefined || !unit) {
      return NextResponse.json(
        { message: "ingredientId, quantity, and unit are required" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the shopping list that belongs to the user
    const shoppingList = await ShoppingList.findOne({
      _id: params.id,
      userId,
    });

    if (!shoppingList) {
      return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
    }

    // Create the new item object
    const newItem = {
      _id: new mongoose.Types.ObjectId(), // subdocument id
      ingredientId: new mongoose.Types.ObjectId(ingredientId),
      quantity,
      unit,
      purchased: purchased || false,
    };

    // Push new item into shopping list
    shoppingList.items.push(newItem);

    await shoppingList.save();

    return NextResponse.json({ message: "Item added successfully", item: newItem, shoppingList }, { status: 201 });
  } catch (error) {
    console.error("Error adding shopping list item:", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Server error" },
      { status: 500 }
    );
  }
}
