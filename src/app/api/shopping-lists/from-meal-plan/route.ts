// PATH: src/app/api/shopping-lists/from-meal-plan/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth"; // your working auth flow

export async function POST(req: NextRequest) {
  await connectDB();

  // Extract user from request (your auth flow)
  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = payload.id;

  // Parse mealPlanId from body
  const { mealPlanId } = await req.json();
  if (!mealPlanId) {
    return NextResponse.json(
      { error: "mealPlanId is required" },
      { status: 400 }
    );
  }

  // Fetch meal plan for this user
  const mealPlan = await MealPlan.findOne({
    _id: mealPlanId,
    user: userId,
  }).populate("recipes");
  if (!mealPlan) {
    return NextResponse.json({ error: "Meal plan not found" }, { status: 404 });
  }

  // Aggregate all ingredients from the recipes in the meal plan
  const items = (mealPlan.recipes || []).flatMap(
    (recipe: any) => recipe.ingredients || []
  );

  // Create shopping list
  const newList = await ShoppingList.create({
    user: userId,
    title: "From Meal Plan",
    items,
  });

  // Return normalized shopping list
  return NextResponse.json({
    id: newList._id.toString(),
    items: newList.items.map((item) => ({
      id: item._id.toString(),
      name: item.name,
      checked: item.checked,
    })),
    user: newList.user,
    createdAt: newList.createdAt?.toISOString(),
    updatedAt: newList.updatedAt?.toISOString(),
  });
}
