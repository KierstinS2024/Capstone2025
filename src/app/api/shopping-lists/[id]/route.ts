// ===========================================
// src/app/api/shopping-lists/[id]/route.ts
// ===========================================
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  await dbConnect();
  const body = await req.json();
  const updated = await ShoppingList.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  await dbConnect();
  await ShoppingList.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
