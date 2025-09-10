// src/app/api/shopping-lists/route.ts
"use client"; // Required for hooks in helpers if any

/**
 * ShoppingList API routes
 * GET: fetch all shopping lists
 * POST: create a new shopping list
 */

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { ShoppingList } from "@/models/ShoppingList"; // ✅ named import

/** GET: fetch all shopping lists, optionally filtered by userId */
export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    const filter = userId ? { userId } : {};
    const lists = await ShoppingList.find(filter);

    return NextResponse.json(lists, { status: 200 });
  } catch (error) {
    console.error("GET /shopping-lists error:", error);
    return NextResponse.json(
      { message: "Failed to fetch shopping lists" },
      { status: 500 }
    );
  }
}

/** POST: create a new shopping list */
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const data = await req.json();

    // Basic validation
    if (!data.name || !data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        { message: "Invalid shopping list data" },
        { status: 400 }
      );
    }

    const newList = await ShoppingList.create({
      ...data,
      source: data.source || "local",
    });

    return NextResponse.json(newList, { status: 201 });
  } catch (error) {
    console.error("POST /shopping-lists error:", error);
    return NextResponse.json(
      { message: "Failed to create shopping list" },
      { status: 500 }
    );
  }
}
