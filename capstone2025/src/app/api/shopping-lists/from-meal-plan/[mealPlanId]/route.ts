// path: src/app/api/shopping-lists/from-meal-plan/[mealPlanId]/route.ts
/**
 * Generate Shopping List from Meal Plan
 * -------------------------------------
 * POST /api/shopping-lists/from-meal-plan/:mealPlanId
 *
 * Functionality:
 * - Aggregates all ingredients from all recipes in a meal plan
 * - Totals quantities of duplicate ingredients
 * - Sets `purchased: false` for all items
 * - Links shopping list to `mealPlanId`
 * - JWT-protected; only the owner can generate
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";
import mongoose from "mongoose";

await connectToDatabase();

// -----------------------------
// Type Definitions
// -----------------------------
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

interface AggregatedItem {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  purchased: boolean;
}

// -----------------------------
// Helper: Get userId
// -----------------------------
async function getUserIdFromRequest(req: NextRequest): Promise<string | null> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return null;
  const token = authHeader.replace("Bearer ", "");
  return verifyToken(token);
}

// -----------------------------
// POST /from-meal-plan/:mealPlanId
// -----------------------------
export async function POST(
  req: NextRequest,
  { params }: { params: { mealPlanId: string } }
) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );

    const { mealPlanId } = params;

    // Validate mealPlanId
    if (!mongoose.Types.ObjectId.isValid(mealPlanId))
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Invalid meal plan ID" },
        { status: 400 }
      );

    // Fetch meal plan and populate recipes
    const mealPlan = await MealPlan.findOne({
      _id: mealPlanId,
      userId,
    }).populate("entries.recipeId");
    if (!mealPlan)
      return NextResponse.json<ApiResponse<null>>(
        { success: false, message: "Meal plan not found or unauthorized" },
        { status: 404 }
      );

    // Aggregate ingredients
    const aggregatedItems: Record<string, AggregatedItem> = {};

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

    return NextResponse.json<ApiResponse<typeof newList>>(
      {
        success: true,
        message: "Shopping list created from meal plan",
        data: newList,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /from-meal-plan/:mealPlanId error:", err);
    return NextResponse.json<ApiResponse<null>>(
      {
        success: false,
        message: err instanceof Error ? err.message : "Server error",
      },
      { status: 500 }
    );
  }
}
