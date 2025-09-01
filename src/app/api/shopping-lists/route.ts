// src/app/api/shopping-lists/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ShoppingList from "@/models/ShoppingList";

// Helper to extract userId from Authorization header
function getUserId(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.split(" ")[1]);
}

// GET: List all shopping lists for the authenticated user
export async function GET(req: NextRequest) {
  await connectToDatabase();

  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const lists = await ShoppingList.find({ userId });
    return NextResponse.json({ lists });
  } catch {
    return NextResponse.json({ message: "Error fetching shopping lists" }, { status: 500 });
  }
}

// POST: Create a new shopping list
export async function POST(req: NextRequest) {
  await connectToDatabase();

  const userId = getUserId(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const { mealPlanId, items } = await req.json();

    const newList = await ShoppingList.create({
      userId,
      mealPlanId,
      createdAt: new Date(),
      items: items || [],
    });

    return NextResponse.json({ list: newList }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Error creating shopping list" }, { status: 500 });
  }
}
