// src/pages/api/meal-plans/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";

// Handles GET, PUT, DELETE for a single meal plan by its ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  // Verify user from Authorization header
  let userId: string;
  try {
    const verified = verifyToken(req.headers.authorization || "");
    if (!verified) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }
    userId = verified; // Safe because we checked above
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

  // GET a meal plan
  if (req.method === "GET") {
    try {
      const plan = await MealPlan.findById(id);
      if (!plan) return res.status(404).json({ message: "Meal plan not found" });
      return res.status(200).json({ plan });
    } catch {
      return res.status(500).json({ message: "Error fetching meal plan" });
    }
  }

  // PUT (update) a meal plan
  if (req.method === "PUT") {
    try {
      const plan = await MealPlan.findById(id);
      if (!plan) return res.status(404).json({ message: "Meal plan not found" });
      if (plan.userId.toString() !== userId) return res.status(403).json({ message: "Not authorized" });

      const { weekStartDate, notes, entries } = req.body;

      // Update only fields that are provided
      plan.weekStartDate = weekStartDate ?? plan.weekStartDate;
      plan.notes = notes ?? plan.notes;
      plan.entries = entries ?? plan.entries;

      await plan.save();
      return res.status(200).json({ plan });
    } catch {
      return res.status(500).json({ message: "Error updating meal plan" });
    }
  }

  // DELETE a meal plan
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
