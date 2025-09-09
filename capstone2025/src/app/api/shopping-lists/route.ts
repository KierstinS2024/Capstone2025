"use server";

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";
import { shoppingListFormSchema } from "@/schemas/shoppingListForm";
import { ZodError } from "zod";

// GET /shopping-lists
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const lists = await ShoppingList.find({ userId })
      .sort({ createdAt: -1 })
      .lean();
    return NextResponse.json({ success: true, data: lists });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      {
        success: false,
        message:
          err instanceof Error ? err.message : "Failed to fetch shopping lists",
      },
      { status: 500 }
    );
  }
}

// POST /shopping-lists
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const userId = requireAuth(req);

    const body = await req.json();
    const parsed = shoppingListFormSchema.parse(body);

    const newList = await ShoppingList.create({ ...parsed, userId });
    return NextResponse.json({ success: true, data: newList }, { status: 201 });
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
      { success: false, message: "Failed to create shopping list" },
      { status: 500 }
    );
  }
}
