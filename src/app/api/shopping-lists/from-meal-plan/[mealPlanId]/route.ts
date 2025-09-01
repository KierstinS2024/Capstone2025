// path: src/app/api/shopping-lists/from-meal-plan/[mealPlanId]/route.ts
/** 
 * Shopping List Generation from Meal Plan
 *
 * POST: Generate a new shopping list based on a specified meal plan.
 * Aggregates ingredients from all recipes in the meal plan, accounting for servings.
 *
 * Authentication:
 *  - Requires a valid JWT in the Authorization header.
 *
 * Process:
 * 1. Verify user authentication.
 * 2. Fetch the meal plan by ID.
 * 3. Aggregate ingredients from all recipes, scaling quantities by servings.
 * 4. Create shopping list items and store in MongoDB.
 */

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";
import Recipe from "@/models/Recipe";
import ShoppingList from "@/models/ShoppingList";

export async function POST(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    // Step 1: Verify JWT
    const authHeader = req.headers.get("authorization");
    const userId = verifyToken(authHeader); // throws if invalid

    // Step 2: Connect to MongoDB
    await connectToDatabase();

    // Step 3: Fetch meal plan and validate ownership
    const mealPlan = await MealPlan.findById(params.mealPlanId);
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });
    if (mealPlan.userId.toString() !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    // Step 4: Aggregate ingredients from all recipes
    const ingredientMap: Record<string, { ingredientId: mongoose.Types.ObjectId; quantity: number; unit: string }> = {};

    for (const entry of mealPlan.entries) {
      const recipe = await Recipe.findById(entry.recipeId);
      if (!recipe || !recipe.ingredients) continue;

      for (const item of recipe.ingredients) {
        const key = item.ingredientId.toString();
        if (!ingredientMap[key]) {
          ingredientMap[key] = {
            ingredientId: item.ingredientId,
            quantity: item.quantity * entry.servings,
            unit: item.unit,
          };
        } else {
          ingredientMap[key].quantity += item.quantity * entry.servings;
        }
      }
    }

    // Step 5: Create shopping list items
    const shoppingListItems = Object.values(ingredientMap).map(item => ({
      _id: new mongoose.Types.ObjectId(),
      ingredientId: item.ingredientId,
      quantity: item.quantity,
      unit: item.unit,
      purchased: false,
    }));

    // Step 6: Create and save shopping list in MongoDB
    const shoppingList = await ShoppingList.create({
      userId: new mongoose.Types.ObjectId(userId),
      title: `Shopping List for ${mealPlan.weekStartDate?.toDateString() || "Meal Plan"}`,
      items: shoppingListItems,
      createdAt: new Date(),
    });

    // Step 7: Return newly created shopping list
    return NextResponse.json({ shoppingList }, { status: 201 });
  } catch (error) {
    console.error("Error generating shopping list from meal plan:", error);
    return NextResponse.json({ message: "Failed to generate shopping list" }, { status: 500 });
  }
}
