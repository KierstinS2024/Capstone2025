// src/pages/api/recipes/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";

// I handle listing recipes and creating a new recipe
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === "GET") {
    // Optionally filter by query parameters
    const { cuisine, ingredient } = req.query;
    const filter: any = {};
    if (cuisine) filter.cuisine = cuisine;
    if (ingredient) filter["ingredients.name"] = ingredient;

    const recipes = await Recipe.find(filter);
    return res.status(200).json(recipes);
  }

  if (req.method === "POST") {
    try {
      // Verify JWT
      const authHeader = req.headers.authorization;
      const userId = verifyToken(authHeader);

      const { name, description, instructions, nutritionInfo, cuisine } = req.body;
      if (!name || !instructions) {
        return res.status(400).json({ message: "Name and instructions are required" });
      }

      const newRecipe = await Recipe.create({
        name,
        description,
        instructions,
        nutritionInfo,
        cuisine,
        userSubmitted: true,
        createdByUserId: userId
      });

      return res.status(201).json(newRecipe);
    } catch (error: any) {
      return res.status(401).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
