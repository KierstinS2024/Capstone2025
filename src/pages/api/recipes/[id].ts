// src/pages/api/recipes/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";

// I handle GET, PUT, and DELETE for a single recipe by its ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase(); // Make sure I'm connected to MongoDB

  const { id } = req.query; // I grab the recipe ID from the URL
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid recipe ID" });
  }

  // GET: fetch a single recipe
  if (req.method === "GET") {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    return res.status(200).json(recipe);
  }

  try {
    // For PUT and DELETE, I need the user to be authenticated
    const authHeader = req.headers.authorization;
    const userId = verifyToken(authHeader);

    // PUT: update the recipe (only if the current user created it)
    if (req.method === "PUT") {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });

      if (recipe.createdByUserId?.toString() !== userId) {
        return res.status(403).json({ message: "You can only edit your own recipes" });
      }

      // I update only fields that are provided
      const { name, description, instructions, nutritionInfo, cuisine } = req.body;
      if (name) recipe.name = name;
      if (description) recipe.description = description;
      if (instructions) recipe.instructions = instructions;
      if (nutritionInfo) recipe.nutritionInfo = nutritionInfo;
      if (cuisine) recipe.cuisine = cuisine;

      await recipe.save();
      return res.status(200).json(recipe);
    }

    // DELETE: remove the recipe (only if the current user created it)
    if (req.method === "DELETE") {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });

      if (recipe.createdByUserId?.toString() !== userId) {
        return res.status(403).json({ message: "You can only delete your own recipes" });
      }

      await recipe.remove();
      return res.status(200).json({ message: "Recipe deleted successfully" });
    }
  } catch (error: any) {
    return res.status(401).json({ message: error.message });
  }

  // If the HTTP method is not supported
  return res.status(405).json({ message: "Method not allowed" });
}
