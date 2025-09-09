// src/app/api/external/recipes/[id]/route.ts

import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const SPOONACULAR_KEY = process.env.SPOONACULAR_KEY;

  if (!SPOONACULAR_KEY) {
    return NextResponse.json({ error: "Spoonacular API key not configured" }, { status: 500 });
  }

  try {
    // Fetch the recipe by ID
    const res = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_KEY}`
    );

    if (!res.ok) throw new Error("Failed to fetch recipe from Spoonacular");

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch external recipe" }, { status: 500 });
  }
}
