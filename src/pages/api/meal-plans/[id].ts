// src/pages/api/meal-plans/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";

// Handles fetching, updating, or deleting a single meal plan
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  let userId: string;
  try {
    userId = verifyToken(req.headers.authorization || "");
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

  if (req.method === "GET") {
    try {
      const plan = await MealPlan.findById(id);
      if (!plan) return res.status(404).json({ message: "Meal plan not found" });
      return res.status(200).json({ plan });
    } catch {
      return res.status(500).json({ message: "Error fetching meal plan" });
    }
  }

  if (req.method === "PUT") {
    try {
      const plan = await MealPlan.findById(id);
      if (!plan) return res.status(404).json({ message: "Meal plan not found" });
      if (plan.userId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

      const { weekStartDate, notes, entries } = req.body;
      plan.weekStartDate = weekStartDate || plan.weekStartDate;
      plan.notes = notes || plan.notes;
      plan.entries = entries || plan.entries;

      await plan.save();
      return res.status(200).json({ plan });
    } catch {
      return res.status(500).json({ message: "Error updating meal plan" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const plan = await MealPlan.findById(id);
      if (!plan) return res.status(404).json({ message: "Meal plan not found" });
      if (plan.userId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

      await plan.deleteOne();
      return res.status(200).json({ message: "Meal plan deleted" });
    } catch {
      return res.status(500).json({ message: "Error deleting meal plan" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
