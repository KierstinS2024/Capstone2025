// src/pages/api/meal-plans/[id].ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;

  // Verify user from Authorization header
  let userId: string;
  try {
    const verified = verifyToken(req.headers.authorization || "");
    if (!verified) return res.status(401).json({ message: "Invalid or missing token" });
    userId = verified;
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

  try {
    const plan = await MealPlan.findById(id);
    if (!plan) return res.status(404).json({ message: "Meal plan not found" });

    // Always enforce ownership
    if (plan.userId.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (req.method === "GET") {
      return res.status(200).json(plan); // return raw plan object
    }

    if (req.method === "PUT") {
      const { weekStartDate, notes, entries } = req.body;
      plan.weekStartDate = weekStartDate ?? plan.weekStartDate;
      plan.notes = notes ?? plan.notes;
      plan.entries = entries ?? plan.entries;

      await plan.save();
      return res.status(200).json(plan);
    }

    if (req.method === "DELETE") {
      await plan.deleteOne();
      return res.status(200).json({ message: "Meal plan deleted" });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error handling meal plan" });
  }
}
