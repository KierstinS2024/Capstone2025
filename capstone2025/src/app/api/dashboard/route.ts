// src/app/api/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";

import FoodIntake, { IFoodIntake } from "@/models/FoodIntake";
import ShoppingList, { IShoppingList } from "@/models/ShoppingList";
import Recipe, { IRecipe } from "@/models/Recipe";

// Cookie name for JWT
const COOKIE_NAME = "token";

// Dashboard response shape
interface DashboardData {
  nextMeal: string | null;
  shoppingListCount: number;
  recentIntake: string | null;
  favoritesCount: number;
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const token = req.cookies.get(COOKIE_NAME)?.value;
    if (!token)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userId = verifyToken(token);
    if (!userId)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // -------------------
    // Fetch data concurrently
    // -------------------
    const [recentFood, shoppingLists, favorites] = await Promise.all([
      FoodIntake.find({ user: userId })
        .sort({ date: -1 })
        .limit(1)
        .lean<IFoodIntake[]>(),
      ShoppingList.find({ user: userId }).lean<IShoppingList[]>(),
      Recipe.find({ user: userId, favorite: true }).lean<IRecipe[]>(),
    ]);

    const dashboardData: DashboardData = {
      nextMeal: null, // if you have a meal-plans collection, replace with next meal logic
      shoppingListCount: shoppingLists.reduce(
        (sum, list) => sum + (list.items?.length || 0),
        0
      ),
      recentIntake: recentFood.length ? recentFood[0].name : null,
      favoritesCount: favorites.length,
    };

    return NextResponse.json(dashboardData, { status: 200 });
  } catch (err) {
    console.error("Dashboard route error:", err);
    return NextResponse.json(
      { message: err instanceof Error ? err.message : "Server error" },
      { status: 500 }
    );
  }
}
