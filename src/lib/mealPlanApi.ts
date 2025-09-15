// src/lib/mealPlanApi.ts
import { connectDb } from "@/lib/db";
import MealPlan, { IMealPlan } from "@/models/MealPlan";

// Fetch all meal plans for a user
export async function fetchMealPlans(userId: string): Promise<IMealPlan[]> {
  await connectDb();
  const plans = await MealPlan.find({ userId }).lean();
  return plans as IMealPlan[];
}

// Create a new meal plan
export async function createMealPlan(
  userId: string,
  startDate: string,
  endDate: string
): Promise<IMealPlan> {
  await connectDb();
  const plan = new MealPlan({ userId, startDate, endDate, meals: [] });
  await plan.save();
  return plan.toObject() as IMealPlan;
}

// Add meal to plan
export async function addMeal(userId: string, planId: string, meal: any) {
  await connectDb();
  const plan = await MealPlan.findOne({ _id: planId, userId });
  if (!plan) throw new Error("Meal plan not found");
  plan.meals.push(meal);
  await plan.save();
  return plan.toObject();
}

// Remove meal from plan
export async function removeMeal(
  userId: string,
  planId: string,
  mealId: string
) {
  await connectDb();
  const plan = await MealPlan.findOne({ _id: planId, userId });
  if (!plan) throw new Error("Meal plan not found");
  plan.meals = plan.meals.filter((m) => m._id?.toString() !== mealId);
  await plan.save();
  return plan.toObject();
}

// Delete a meal plan
export async function deleteMealPlan(userId: string, planId: string) {
  await connectDb();
  const deleted = await MealPlan.findOneAndDelete({ _id: planId, userId });
  if (!deleted) throw new Error("Meal plan not found");
  return deleted.toObject();
}
