// path: src/app/api/shopping-lists/route.ts
/**
 * Shopping Lists API Route
 *
 * GET: Fetch all shopping lists for the authenticated user
 * POST: Create a new shopping list for the authenticated user
 *
 * Uses JWT for authentication and MongoDB (via Mongoose) for storage.
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader); // throws if invalid

    await connectToDatabase();

    // Find all shopping lists for this user, sorted by creation date
    const lists = await ShoppingList.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json({ lists });
  } catch (err) {
    console.error("Error fetching shopping lists:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Unauthorized" },
      { status: 401 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader); // throws if invalid

    const { title, items } = await req.json();

    if (!title) {
      return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    await connectToDatabase();

    // Create a new shopping list
    const newList = await ShoppingList.create({
      userId: new mongoose.Types.ObjectId(userId),
      title,
      items: items?.map((item: any) => ({
        ingredientId: new mongoose.Types.ObjectId(item.ingredientId),
        quantity: item.quantity,
        unit: item.unit,
        purchased: false,
      })) || [],
      createdAt: new Date(),
    });

    return NextResponse.json({ list: newList }, { status: 201 });
  } catch (err) {
    console.error("Error creating shopping list:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
