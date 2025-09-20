// ===========================================
// src/app/api/recipes/[id]/route.ts
// ===========================================
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Recipe from "@/models/Recipe";

interface Params {
  params: { id: string };
}

export async function GET(_: Request, { params }: Params) {
  await connectDB();
  const recipe = await Recipe.findById(params.id);
  return NextResponse.json(recipe);
}

export async function PUT(req: Request, { params }: Params) {
  await connectDB();
  const body = await req.json();
  const updated = await Recipe.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: Params) {
  await connectDB();
  await Recipe.findByIdAndDelete(params.id);
  return NextResponse.json({ message: "Deleted" });
}
