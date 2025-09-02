// path: src/app/api/shopping-lists/from-meal-plan/[mealPlanId]/route.ts
/**      
 * Generate Shopping List from Meal Plan
 *
 * POST /api/shopping-lists/from-meal-plan/:mealPlanId
 * Creates a shopping list automatically from a specified meal plan.
 * - Combines ingredient quantities from all recipes in the meal plan
 * - Ensures items are unique and totals quantities
 * - JWT-protected for the logged-in user
 */

import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import MealPlan from "@/models/MealPlan";
import Recipe from "@/models/Recipe";
import ShoppingList from "@/models/ShoppingList";
import { verifyToken } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { mealPlanId: string } }) {
  try {
    await connectToDatabase();

    // Verify JWT token
    const token = req.headers.get("Authorization")?.replace("Bearer ", "");
    const userId = token && (await verifyToken(token));
    if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Fetch meal plan
    const mealPlan = await MealPlan.findOne({ _id: params.mealPlanId, userId });
    if (!mealPlan) return NextResponse.json({ message: "Meal plan not found" }, { status: 404 });

    // Aggregate all ingredients from recipes
    const ingredientMap: Record<string, { quantity: number; unit: string }> = {};

    for (const entry of mealPlan.entries) {
      const recipe = await Recipe.findById(entry.recipeId);
      if (!recipe) continue;

      for (const ing of recipe.ingredients) {
        const key = ing.ingredientId.toString();
        const totalQuantity = ing.quantity * entry.servings;

        if (ingredientMap[key]) {
          ingredientMap[key].quantity += totalQuantity;
        } else {
          ingredientMap[key] = { quantity: totalQuantity, unit: ing.unit };
        }
      }
    }

    // Convert map to array for ShoppingList model
    const items = Object.entries(ingredientMap).map(([ingredientId, data]) => ({
      ingredientId,
      quantity: data.quantity,
      unit: data.unit,
      purchased: false,
    }));

    // Create Shopping List
    const shoppingList = await ShoppingList.create({
      userId,
      mealPlanId: mealPlan._id,
      title: `Shopping List for week of ${mealPlan.weekStartDate.toDateString()}`,
      items,
    });

    return NextResponse.json({ message: "Shopping list created", shoppingList });
  } catch (err) {
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
