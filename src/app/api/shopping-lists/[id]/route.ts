// src/app/api/shopping-lists/[id]/route.ts
"use client";

/**
 * ShoppingList API routes for a single shopping list by ID
 * Supports GET, PUT, DELETE
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { ShoppingList } from "@/models/ShoppingList"; // ✅ named import

// Helper to extract ID from request URL
const getIdFromReq = (req: NextRequest) => {
  const url = new URL(req.url);
  return url.pathname.split("/").pop();
};

/** GET: fetch a single shopping list by ID */
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const id = getIdFromReq(req);
    if (!id)
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });

    const list = await ShoppingList.findById(id);
    if (!list)
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json(list, { status: 200 });
  } catch (error) {
    console.error("GET /shopping-lists/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to fetch shopping list" },
      { status: 500 }
    );
  }
}

/** PUT: update a shopping list by ID */
export async function PUT(req: NextRequest) {
  try {
    await connectToDB();

    const id = getIdFromReq(req);
    if (!id)
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });

    const data = await req.json();
    const updatedList = await ShoppingList.findByIdAndUpdate(id, data, {
      new: true,
    });

    if (!updatedList)
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json(updatedList, { status: 200 });
  } catch (error) {
    console.error("PUT /shopping-lists/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update shopping list" },
      { status: 500 }
    );
  }
}

/** DELETE: remove a shopping list by ID */
export async function DELETE(req: NextRequest) {
  try {
    await connectToDB();

    const id = getIdFromReq(req);
    if (!id)
      return NextResponse.json({ message: "ID not provided" }, { status: 400 });

    const deletedList = await ShoppingList.findByIdAndDelete(id);
    if (!deletedList)
      return NextResponse.json(
        { message: "Shopping list not found" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "Shopping list deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /shopping-lists/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to delete shopping list" },
      { status: 500 }
    );
  }
}
