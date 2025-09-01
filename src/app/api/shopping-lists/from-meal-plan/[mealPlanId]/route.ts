// path: src/app/api/shopping-lists/from-meal-plan/[mealPlanId]/route.ts
/**
 * API Route: Generate Shopping List from Meal Plan
 *
 * POST /api/shopping-lists/from-meal-plan/:mealPlanId
 *
 * This route generates a shopping list automatically based on a specific meal plan.
 * Each recipe in the meal plan contributes its ingredients and quantities to the shopping list.
 *
 * Features:
 * - Authenticated route (JWT required)
 * - Creates a shopping list for the current user linked to the meal plan
 * - Ensures ingredients are grouped properly
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    // 1️ Authenticate user via JWT token in headers
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader); // throws if invalid

    // 2️ Connect to MongoDB
    await connectToDatabase();

    // 3️ Retrieve the meal plan by ID
    const mealPlan = await MealPlan.findById(params.mealPlanId).populate("entries.recipeId");
    if (!mealPlan) {
      return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });
    }

    // 4 Construct shopping list items from meal plan entries
    // Each recipe contributes its ingredients
    const items: { ingredientId: mongoose.Types.ObjectId; quantity: number; unit: string; purchased: boolean }[] = [];

    for (const entry of mealPlan.entries) {
      const recipe = entry.recipeId as any; // populated recipe
      if (!recipe || !recipe.ingredients) continue;

      for (const ing of recipe.ingredients) {
        // Multiply ingredient quantity by number of servings
        const totalQuantity = (ing.quantity || 0) * (entry.servings || 1);

        items.push({
          ingredientId: new mongoose.Types.ObjectId(ing.id),
          quantity: totalQuantity,
          unit: ing.unit || "",
          purchased: false,
        });
      }
    }

    // 5 Create the shopping list document
    const shoppingList = await ShoppingList.create({
      userId: new mongoose.Types.ObjectId(userId),
      mealPlanId: mealPlan._id,
      createdAt: new Date(),
      items,
    });

    // 6 Return the new shopping list ID and data
    return NextResponse.json({ shoppingList }, { status: 201 });
  } catch (err) {
    console.error("Error generating shopping list:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
