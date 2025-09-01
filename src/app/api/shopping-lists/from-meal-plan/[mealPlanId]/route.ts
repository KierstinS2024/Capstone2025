// path: src/app/api/shopping-lists/from-meal-plan/[mealPlanId]/route.ts
/**
 * POST /api/shopping-lists/from-meal-plan/:mealPlanId
 *
 * Generate a shopping list based on a meal plan.
 *
 * Workflow:
 * 1. Verify user JWT
 * 2. Fetch meal plan with populated recipes and ingredients
 * 3. Aggregate ingredients across all recipes by ID
 * 4. Create a ShoppingList document
 * 5. Return the created shopping list
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

// Define TypeScript interfaces for clarity
interface RecipeIngredient {
  ingredientId: mongoose.Types.ObjectId;
  quantity: number;
  unit: string;
}

interface MealPlanEntry {
  recipeId: {
    _id: string;
    name: string;
    ingredients: RecipeIngredient[];
  };
  servings: number;
}

export async function POST(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    // 1️ Authenticate user
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2️ Connect to DB
    await connectToDatabase();

    // 3️ Fetch meal plan with recipes populated
    const mealPlan = await MealPlan.findById(params.mealPlanId).populate("entries.recipeId");
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    // 4️ Aggregate ingredients by ingredientId
    const ingredientMap: { [key: string]: { quantity: number; unit: string } } = {};

    for (const entry of mealPlan.entries as MealPlanEntry[]) {
      const recipe = entry.recipeId;
      if (!recipe || !recipe.ingredients) continue;

      for (const ing of recipe.ingredients) {
        const idStr = ing.ingredientId.toString();
        const totalQuantity = ing.quantity * (entry.servings || 1);

        if (!ingredientMap[idStr]) {
          ingredientMap[idStr] = { quantity: totalQuantity, unit: ing.unit };
        } else {
          ingredientMap[idStr].quantity += totalQuantity;
        }
      }
    }

    // 5️ Convert aggregated map to array for ShoppingList
    const items = Object.entries(ingredientMap).map(([ingredientId, data]) => ({
      ingredientId: new mongoose.Types.ObjectId(ingredientId),
      quantity: data.quantity,
      unit: data.unit,
      purchased: false,
    }));

    // 6️ Create ShoppingList document
    const shoppingList = await ShoppingList.create({
      userId: new mongoose.Types.ObjectId(userId),
      mealPlanId: mealPlan._id,
      createdAt: new Date(),
      items,
    });

    // 7️ Return shopping list
    return NextResponse.json({ shoppingList }, { status: 201 });
  } catch (err) {
    console.error("Error generating shopping list:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
  }
}
