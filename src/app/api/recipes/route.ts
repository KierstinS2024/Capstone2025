// src/app/api/recipes/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";
import axios from "axios";

// Helper to extract userId from Authorization header
function getUserIdFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return verifyToken(authHeader.split(" ")[1]);
}

// GET: List recipes (optionally search local DB + Spoonacular)
export async function GET(req: NextRequest) {
  await connectToDatabase();

  const url = new URL(req.url);
  const search = url.searchParams.get("search");

  try {
    let localRecipes = [];
    let externalRecipes: any[] = [];

    if (search) {
      const query = encodeURIComponent(search);

      // Fetch from Spoonacular
      const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
      if (spoonacularApiKey) {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${spoonacularApiKey}`
        );
        externalRecipes = response.data.results.map((r: any) => ({
          title: r.title,
          id: r.id,
          source: "Spoonacular",
        }));
      }

      // Fetch matching local recipes
      localRecipes = await Recipe.find({
        name: { $regex: search, $options: "i" },
      }).limit(10);

      return NextResponse.json({ localRecipes, externalRecipes });
    }

    // If no search term, return first 20 recipes
    localRecipes = await Recipe.find().limit(20);
    return NextResponse.json({ recipes: localRecipes });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error fetching recipes" }, { status: 500 });
  }
}

// POST: Create a new recipe (requires authentication)
export async function POST(req: NextRequest) {
  await connectToDatabase();

  const userId = getUserIdFromRequest(req);
  if (!userId) return NextResponse.json({ message: "Invalid or missing token" }, { status: 401 });

  try {
    const body = await req.json();
    const { name, description, instructions, nutritionInfo, cuisine } = body;

    if (!name || !instructions) {
      return NextResponse.json({ message: "Recipe name and instructions are required" }, { status: 400 });
    }

    const newRecipe = await Recipe.create({
      name,
      description,
      instructions,
      nutritionInfo,
      cuisine,
      userSubmitted: true,
      createdByUserId: userId,
    });

    return NextResponse.json({ recipe: newRecipe }, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
