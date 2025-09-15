// src/lib/recipeApi.ts
import { connectDb } from "./db";
import Recipe, { IRecipe } from "@/models/Recipe";
import { Types } from "mongoose";

// Fetch recipe by ID
export async function getRecipeById(id: string): Promise<IRecipe | null> {
  await connectDb();
  const recipe = await Recipe.findById(id);
  return recipe ? recipe.toObject() : null;
}

// Search recipes by name
export async function searchRecipes(query: string): Promise<IRecipe[]> {
  await connectDb();
  const regex = new RegExp(query, "i");
  const recipes = await Recipe.find({ name: regex }).limit(20);
  return recipes.map((r) => r.toObject());
}

// Toggle favorite
export async function toggleFavorite(
  recipeId: string,
  userId: string
): Promise<IRecipe | null> {
  await connectDb();
  const recipe = await Recipe.findOne({ _id: recipeId, userId });
  if (!recipe) return null;
  recipe.favorite = !recipe.favorite;
  await recipe.save();
  return recipe.toObject();
}
