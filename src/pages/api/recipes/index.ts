// src/pages/api/recipes/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";

// Handles listing all recipes or creating a new recipe
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  // GET /api/recipes → return all recipes
  if (req.method === "GET") {
    try {
      const recipes = await Recipe.find({});
      return res.status(200).json({ recipes });
    } catch (err) {
      return res.status(500).json({ message: "Error fetching recipes" });
    }
  }

  // POST /api/recipes → create a new recipe (requires authentication)
  if (req.method === "POST") {
    try {
      const userId = verifyToken(req.headers.authorization);

      const { name, description, instructions, nutritionInfo, cuisine } = req.body;

      if (!name) return res.status(400).json({ message: "Recipe name is required" });

      const newRecipe = await Recipe.create({
        name,
        description,
        instructions: instructions || [],
        nutritionInfo: nutritionInfo || {},
        cuisine: cuisine || "",
        userSubmitted: true,
        createdByUserId: userId,
      });

      return res.status(201).json({ recipe: newRecipe });
    } catch (err: any) {
      return res.status(401).json({ message: err.message });
    }
  }

  // Reject any other methods
  return res.status(405).json({ message: "Method not allowed" });
}
