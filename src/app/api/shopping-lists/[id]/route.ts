// path: src/app/api/shopping-lists/[id]/route.ts
/**
 * Shopping List Detail API Route
 *
 * GET: Retrieve a single shopping list by ID
 * PUT: Update the shopping list (title or items)
 * DELETE: Remove the shopping list
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req.headers.get("authorization"));
    await connectToDatabase();

    const list = await ShoppingList.findOne({ _id: params.id, userId });

    if (!list) {
      return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
    }

    return NextResponse.json({ list });
  } catch (err) {
    console.error("Error fetching shopping list:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req.headers.get("authorization"));
    const { title, items } = await req.json();

    await connectToDatabase();

    const list = await ShoppingList.findOne({ _id: params.id, userId });
    if (!list) {
      return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
    }

    if (title) list.title = title;

    if (items) {
      list.items = items.map((item: any) => ({
        ingredientId: new mongoose.Types.ObjectId(item.ingredientId),
        quantity: item.quantity,
        unit: item.unit,
        purchased: item.purchased || false,
      }));
    }

    await list.save();

    return NextResponse.json({ list });
  } catch (err) {
    console.error("Error updating shopping list:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const userId = verifyToken(req.headers.get("authorization"));
    await connectToDatabase();

    const list = await ShoppingList.findOneAndDelete({ _id: params.id, userId });
    if (!list) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });

    return NextResponse.json({ message: "Shopping list deleted" });
  } catch (err) {
    console.error("Error deleting shopping list:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
