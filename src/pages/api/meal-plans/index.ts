// src/pages/api/meal-plans/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import MealPlan from "@/models/MealPlan";

// Handles GET (list) and POST (create) for meal plans
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  // Verify the user for protected routes
  let userId: string;
  try {
    const verified = verifyToken(req.headers.authorization || "");
    if (!verified) {
      return res.status(401).json({ message: "Invalid or missing token" });
    }
    userId = verified;
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

  // GET: List all meal plans for this user
  if (req.method === "GET") {
    try {
      const plans = await MealPlan.find({ userId });
      return res.status(200).json({ plans });
    } catch {
      return res.status(500).json({ message: "Error fetching meal plans" });
    }
  }

  // POST: Create a new meal plan
  if (req.method === "POST") {
    try {
      const { weekStartDate, notes, entries } = req.body;

      // Create a new meal plan document
      const newPlan = await MealPlan.create({
        userId,
        weekStartDate,
        notes,
        entries: entries || [],
      });

      return res.status(201).json({ plan: newPlan });
    } catch {
      return res.status(500).json({ message: "Error creating meal plan" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
