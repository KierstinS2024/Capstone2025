"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";
import mongoose from "mongoose";
import { shoppingListFormSchema } from "@/schemas/shoppingListForm";
import { ZodError } from "zod";

// GET /shopping-lists/:id
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const list = await ShoppingList.findOne({ _id: id, userId }).lean();
    if (!list)
      return NextResponse.json(
        { success: false, message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: list });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch shopping list" },
      { status: 500 }
    );
  }
}

// PUT /shopping-lists/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const body = await req.json();
    const parsed = shoppingListFormSchema.parse(body);

    const updatedList = await ShoppingList.findOneAndUpdate(
      { _id: id, userId },
      parsed,
      { new: true }
    );
    if (!updatedList)
      return NextResponse.json(
        { success: false, message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json({ success: true, data: updatedList });
  } catch (err) {
    console.error(err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: err.issues.map((i) => i.message).join(", "),
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: "Failed to update shopping list" },
      { status: 500 }
    );
  }
}

// DELETE /shopping-lists/:id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);
    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return NextResponse.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );

    const deleted = await ShoppingList.findOneAndDelete({ _id: id, userId });
    if (!deleted)
      return NextResponse.json(
        { success: false, message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json({
      success: true,
      message: "Shopping list deleted",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to delete shopping list" },
      { status: 500 }
    );
  }
}
