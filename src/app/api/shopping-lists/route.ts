// ===========================================
// PATH: src/app/api/shopping-lists/route.ts
// Unified Shopping List API
// - Each user has their own shopping list
// - Supports: get, add, toggle, remove, clear
// ===========================================

import { NextResponse, type NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import ShoppingList from "@/models/ShoppingList";
import MealPlan from "@/models/MealPlan";
import { getUserFromRequest } from "@/lib/serverAuth";

// -------------------------------------------
// Helper: normalize list → plain JSON
// Converts MongoDB _id → id and strips mongoose junk
// -------------------------------------------
function normalizeList(list: any) {
  if (!list) {
    return { id: "", user: "", items: [], createdAt: "", updatedAt: "" };
  }

  return {
    id: list._id?.toString() ?? "",
    user: list.user?.toString() ?? "",
    items: (list.items || []).map((item: any) => ({
      id: item._id?.toString() ?? "",
      name: item.name ?? "",
      checked: !!item.checked,
    })),
    createdAt: list.createdAt?.toISOString() ?? "",
    updatedAt: list.updatedAt?.toISOString() ?? "",
  };
}

// -------------------------------------------
// GET /api/shopping-lists
// → Fetch the current user's shopping list
// -------------------------------------------
export async function GET(req: NextRequest) {
  await connectDB();

  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = payload.id;
  console.log("GET shopping list for user:", userId);

  let list = await ShoppingList.findOne({ user: userId });
  if (!list) {
    // Auto-create empty list
    list = await ShoppingList.create({ user: userId, items: [] });
  }

  return NextResponse.json(normalizeList(list));
}

// -------------------------------------------
// POST /api/shopping-lists
// → Add item OR create from meal plan
// Body: { name?: string, mealPlanId?: string }
// -------------------------------------------
export async function POST(req: NextRequest) {
  await connectDB();

  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = payload.id;
  console.log("POST shopping list for user:", userId);

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, mealPlanId } = body;

  let list = await ShoppingList.findOne({ user: userId });
  if (!list) {
    list = await ShoppingList.create({ user: userId, items: [] });
  }

  if (mealPlanId) {
    // Build from meal plan → aggregate ingredients
    const mealPlan = await MealPlan.findOne({
      _id: mealPlanId,
      user: userId,
    }).populate("recipes");

    if (!mealPlan) {
      return NextResponse.json(
        { error: "Meal plan not found" },
        { status: 404 }
      );
    }

    const items = (mealPlan.recipes || []).flatMap(
      (recipe: any) => recipe.ingredients || []
    );

    list.items.push(
      ...items.map((ing: any) => ({ name: ing.name, checked: false }))
    );
  } else if (name) {
    // Add a single item
    list.items.push({ name, checked: false });
  } else {
    return NextResponse.json(
      { error: "Missing name or mealPlanId" },
      { status: 400 }
    );
  }

  await list.save();
  const fresh = await ShoppingList.findOne({ user: userId });
  return NextResponse.json(normalizeList(fresh));
}

// -------------------------------------------
// PATCH /api/shopping-lists?id=<itemId>
// → Toggle an item checked/unchecked
// -------------------------------------------
export async function PATCH(req: NextRequest) {
  await connectDB();

  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = payload.id;
  console.log("PATCH shopping list for user:", userId);

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("id");

  if (!itemId) {
    return NextResponse.json({ error: "Item id required" }, { status: 400 });
  }

  const list = await ShoppingList.findOne({ user: userId });
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  const item = list.items.id(itemId);
  if (!item) {
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  item.checked = !item.checked;
  await list.save();

  const fresh = await ShoppingList.findOne({ user: userId });
  return NextResponse.json(normalizeList(fresh));
}

// -------------------------------------------
// DELETE /api/shopping-lists?id=<itemId>
// → If id present → remove one item
// → If no id → clear all items
// -------------------------------------------
export async function DELETE(req: NextRequest) {
  await connectDB();

  const payload = getUserFromRequest(req);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = payload.id;
  console.log("DELETE shopping list for user:", userId);

  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("id");

  const list = await ShoppingList.findOne({ user: userId });
  if (!list) {
    return NextResponse.json({ error: "List not found" }, { status: 404 });
  }

  if (itemId) {
    list.items = list.items.filter(
      (item: any) => item._id.toString() !== itemId
    );
  } else {
    list.items = [];
  }

  await list.save();
  const fresh = await ShoppingList.findOne({ user: userId });
  return NextResponse.json(normalizeList(fresh));
}
