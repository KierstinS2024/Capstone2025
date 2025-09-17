// src/app/api/shopping-lists/from-meal-plan/route.ts
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import MealPlan from "@/models/MealPlan";
import { verifyAuth } from "@/lib/serverAuth";

export async function POST(req: Request) {
  await dbConnect();
  const userId = await verifyAuth(req);
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { mealPlanId } = await req.json();
  const mealPlan = await MealPlan.findOne({
    _id: mealPlanId,
    user: userId,
  }).populate("recipes");
  if (!mealPlan)
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });

  // Aggregate ingredients from all recipes
  const items = mealPlan.recipes.flatMap((recipe: any) => recipe.ingredients);

  const newList = await ShoppingList.create({
    user: userId,
    title: "From Meal Plan",
    items,
  });
  return NextResponse.json(newList);
}
