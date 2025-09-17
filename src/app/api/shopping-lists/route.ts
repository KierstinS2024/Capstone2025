// ===========================================
// src/app/api/shopping-lists/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";

// GET shopping list (only one active at a time)
export async function GET() {
  await connectDB();
  const list = await ShoppingList.findOne(); // single list
  return NextResponse.json(list);
}

// POST replace shopping list
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  await ShoppingList.deleteMany(); // clear old list
  const newList = await ShoppingList.create(body);
  return NextResponse.json(newList);
}
