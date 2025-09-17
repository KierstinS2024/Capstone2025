// PATH: /api/shopping-lists/from-meal-plan
import { NextResponse } from "next/server";
import { generateListFromMealPlan } from "@/lib/shoppingListApi";
import { getUserFromRequest } from "@/lib/serverAuth";

export async function POST(req: Request) {
  const user = await getUserFromRequest(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { planId } = await req.json();
  // Generate list from given meal plan
  const list = await generateListFromMealPlan(user._id, planId);
  return NextResponse.json({ list });
}
