// src/app/api/shopping-lists/from-meal-plan/route.ts
"use server";

import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import { ShoppingList, type IShoppingItem } from "@/models/ShoppingList";
import { MealPlan } from "@/models/MealPlan";
import type { MealIngredient } from "@/types/mealPlan";

// --------------------
// Category priority map
// --------------------
const CATEGORY_PRIORITY: Record<string, IShoppingItem["category"]> = {
  produce: "produce",
  meat: "meat",
  dairy: "dairy",
  frozen: "frozen",
};

// --------------------
// Unit conversion maps
// --------------------
const volumeUnits: Record<string, number> = {
  ml: 1,
  l: 1000,
  cup: 240,
  tbsp: 15,
  tsp: 5,
};
const weightUnits: Record<string, number> = {
  g: 1,
  kg: 1000,
  oz: 28.3495,
  lb: 453.592,
};

// --------------------
// Helpers
// --------------------
const parseQuantity = (qty: string) => {
  const match = qty.trim().match(/^([\d.]+)\s*(\w*)$/);
  if (!match) return { amount: 0, unit: "" };
  return { amount: parseFloat(match[1]), unit: match[2].toLowerCase() };
};

const toBaseUnit = (amount: number, unit: string) =>
  unit in volumeUnits
    ? amount * volumeUnits[unit]
    : unit in weightUnits
    ? amount * weightUnits[unit]
    : amount;

const formatQuantity = (
  amount: number,
  category: IShoppingItem["category"]
) => {
  switch (category) {
    case "dairy":
      return amount >= 1000 ? `${amount / 1000} l` : `${amount} ml`;
    case "meat":
    case "frozen":
      return amount >= 1000 ? `${amount / 1000} kg` : `${amount} g`;
    default:
      return amount.toString();
  }
};

// --------------------
// POST handler
// --------------------
export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const { mealPlanId } = await req.json();
    if (!mealPlanId)
      return NextResponse.json(
        { message: "mealPlanId is required" },
        { status: 400 }
      );

    const mealPlan = await MealPlan.findById(mealPlanId);
    if (!mealPlan)
      return NextResponse.json(
        { message: "Meal plan not found" },
        { status: 404 }
      );

    // --------------------
    // Aggregate ingredients
    // --------------------
    const aggregated = new Map<
      string,
      { amount: number; category: IShoppingItem["category"]; name: string }
    >();

    (mealPlan.entries as any[]).forEach((entry) => {
      const ingredients: MealIngredient[] | undefined = entry.ingredients;
      if (!ingredients) return;

      ingredients.forEach((ing) => {
        const category: IShoppingItem["category"] =
          (ing.category && CATEGORY_PRIORITY[ing.category.toLowerCase()]) ||
          "other";

        const key = ing.name.toLowerCase();
        const { amount, unit } = parseQuantity(ing.quantity);
        const baseAmount = toBaseUnit(amount, unit);

        if (aggregated.has(key)) {
          const existing = aggregated.get(key)!;
          if (existing.category !== category) {
            const priorities = ["produce", "meat", "dairy", "frozen", "other"];
            const existingIndex = priorities.indexOf(existing.category);
            const newIndex = priorities.indexOf(category);
            if (newIndex < existingIndex) existing.category = category;
          }
          existing.amount += baseAmount;
        } else {
          aggregated.set(key, { amount: baseAmount, category, name: ing.name });
        }
      });
    });

    // --------------------
    // Format final items
    // --------------------
    const items: IShoppingItem[] = Array.from(aggregated.values()).map(
      (item) => ({
        ingredient: item.name,
        quantity: formatQuantity(item.amount, item.category),
        category: item.category,
        checked: false,
      })
    );

    // --------------------
    // Create shopping list
    // --------------------
    const shoppingList = await ShoppingList.create({
      title: `${mealPlan.title} Shopping List`,
      items,
      source: "generated",
      userId: mealPlan.userId,
    });

    return NextResponse.json(shoppingList, { status: 201 });
  } catch (error) {
    console.error("POST /shopping-lists/from-meal-plan error:", error);
    return NextResponse.json(
      { message: "Failed to generate shopping list" },
      { status: 500 }
    );
  }
}
