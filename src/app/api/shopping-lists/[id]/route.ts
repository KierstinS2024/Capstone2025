/* src/app/api/shopping-lists/[id]/route.ts */
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ShoppingList, { ShoppingListItem } from "@/models/ShoppingList";

// Helper to extract userId from Authorization header
function getUserId(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.split(" ")[1]);
}

// GET: Retrieve a shopping list
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const list = await ShoppingList.findById(params.id);
  if (!list) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
  if (list.userId.toString() !== userId) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  return NextResponse.json({ list });
}

// POST: Add a new item
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const list = await ShoppingList.findById(params.id);
  if (!list) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
  if (list.userId.toString() !== userId) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  try {
    const { ingredientId, quantity, unit } = await req.json();

    const newItem: ShoppingListItem = {
      _id: new mongoose.Types.ObjectId(),
      ingredientId: new mongoose.Types.ObjectId(ingredientId),
      quantity,
      unit,
      purchased: false,
    };

    list.items.push(newItem);
    await list.save();

    return NextResponse.json({ list }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error adding item" }, { status: 500 });
  }
}

// PATCH: Update an item
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const list = await ShoppingList.findById(params.id);
  if (!list) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
  if (list.userId.toString() !== userId) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  try {
    const { itemId, quantity, purchased } = await req.json();
    const item = list.items.find((i) => i._id.toString() === itemId);
    if (!item) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    if (quantity !== undefined) item.quantity = quantity;
    if (purchased !== undefined) item.purchased = purchased;

    await list.save();
    return NextResponse.json({ list });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error updating item" }, { status: 500 });
  }
}

// DELETE: Remove an item
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  const list = await ShoppingList.findById(params.id);
  if (!list) return NextResponse.json({ message: "Shopping list not found" }, { status: 404 });
  if (list.userId.toString() !== userId) return NextResponse.json({ message: "Not authorized" }, { status: 403 });

  try {
    const { itemId } = await req.json();
    const index = list.items.findIndex((i) => i._id.toString() === itemId);
    if (index === -1) return NextResponse.json({ message: "Item not found" }, { status: 404 });

    list.items.splice(index, 1);
    await list.save();
    return NextResponse.json({ list });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error deleting item" }, { status: 500 });
  }
}
