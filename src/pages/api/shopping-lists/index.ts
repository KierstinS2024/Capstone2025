// src/pages/api/shopping-lists/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import ShoppingList from "@/models/ShoppingList";

// Handles GET (list) and POST (create) shopping lists
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  // Authenticate user
  let userId: string;
  try {
    const verified = verifyToken(req.headers.authorization || "");
    if (!verified) return res.status(401).json({ message: "Invalid or missing token" });
    userId = verified;
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

  // GET: return all shopping lists for this user
  if (req.method === "GET") {
    try {
      const lists = await ShoppingList.find({ userId });
      return res.status(200).json({ lists });
    } catch {
      return res.status(500).json({ message: "Error fetching shopping lists" });
    }
  }

  // POST: create a new shopping list
  if (req.method === "POST") {
    try {
      const { mealPlanId, items } = req.body;

      const newList = await ShoppingList.create({
        userId,
        mealPlanId,
        createdAt: new Date(),
        items: items || [],
      });

      return res.status(201).json({ list: newList });
    } catch {
      return res.status(500).json({ message: "Error creating shopping list" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
