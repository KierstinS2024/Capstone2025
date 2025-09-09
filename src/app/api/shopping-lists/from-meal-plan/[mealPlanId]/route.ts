// File: src/app/api/shopping-lists/from-meal-plan/[mealPlanId]/route.ts
/**
 * Generate Shopping List from Meal Plan
 * POST /api/shopping-lists/from-meal-plan/:mealPlanId
 *
 * Creates a shopping list automatically from a specified meal plan:
 * - Combines ingredient quantities from all recipes in the meal plan
 * - Ensures items are unique and totals quantities
 * - Sets purchased: false for all items
 * - Stores mealPlanId for reference
 * - JWT-protected; only the owner can generate
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import ShoppingList from "@/models/ShoppingList";
import { requireAuth } from "@/lib/authHelpers";
import mongoose from "mongoose";

await connectToDatabase();

export async function POST(
  req: NextRequest,
  { params }: { params: { mealPlanId: string } }
) {
  try {
    const userId = requireAuth(req);
    const { mealPlanId } = params;

    // Validate mealPlanId
    if (!mongoose.Types.ObjectId.isValid(mealPlanId)) {
      return NextResponse.json(
        { message: "Invalid meal plan ID" },
        { status: 400 }
      );
    }

    // Fetch meal plan and populate recipes
    const mealPlan = await MealPlan.findOne({
      _id: mealPlanId,
      userId,
    }).populate("entries.recipeId");
    if (!mealPlan) {
      return NextResponse.json(
        { message: "Meal plan not found or unauthorized" },
        { status: 404 }
      );
    }

    // Aggregate ingredients
    const aggregatedItems: Record<
      string,
      {
        ingredientId: string;
        name: string;
        quantity: number;
        unit: string;
        purchased: boolean;
      }
    > = {};

    for (const entry of mealPlan.entries) {
      const recipe = entry.recipeId;
      if (!recipe || !recipe.ingredients) continue;

      for (const ing of recipe.ingredients) {
        const key = ing.ingredientId.toString();
        const totalQuantity = ing.quantity * entry.servings;

        if (!aggregatedItems[key]) {
          aggregatedItems[key] = {
            ingredientId: ing.ingredientId,
            name: ing.name,
            quantity: totalQuantity,
            unit: ing.unit,
            purchased: false,
          };
        } else {
          aggregatedItems[key].quantity += totalQuantity;
        }
      }
    }

    const itemsArray = Object.values(aggregatedItems);

    // Create new shopping list
    const newList = await ShoppingList.create({
      userId,
      mealPlanId: mealPlan._id,
      title: `Shopping List for week of ${
        mealPlan.weekStartDate?.toDateString() || mealPlan.title
      }`,
      items: itemsArray,
    });

    return NextResponse.json(
      { message: "Shopping list created", data: newList },
      { status: 201 }
    );
  } catch (err) {
    console.error("Generate shopping list error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
