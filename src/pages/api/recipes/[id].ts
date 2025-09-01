// src/pages/api/recipes/[id].ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";

// Handles GET, PUT, DELETE for a single recipe by ID
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });
      return res.status(200).json({ recipe });
    } catch {
      return res.status(500).json({ message: "Error fetching recipe" });
    }
  }

  // For PUT and DELETE, user must be authenticated
 let userId: string;
try {
  const verified = verifyToken(req.headers.authorization);
  if (!verified) {
    return res.status(401).json({ message: "Invalid or missing token" });
  }
  userId = verified;
} catch (err: any) {
  return res.status(401).json({ message: err.message });
}


  if (req.method === "PUT") {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });

      // Only allow the creator to edit
      if (recipe.createdByUserId?.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to edit this recipe" });
      }

      const { name, description, instructions, nutritionInfo, cuisine } = req.body;

      recipe.name = name || recipe.name;
      recipe.description = description || recipe.description;
      recipe.instructions = instructions || recipe.instructions;
      recipe.nutritionInfo = nutritionInfo || recipe.nutritionInfo;
      recipe.cuisine = cuisine || recipe.cuisine;

      await recipe.save();
      return res.status(200).json({ recipe });
    } catch {
      return res.status(500).json({ message: "Error updating recipe" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const recipe = await Recipe.findById(id);
      if (!recipe) return res.status(404).json({ message: "Recipe not found" });

      // Only allow the creator to delete
      if (recipe.createdByUserId?.toString() !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this recipe" });
      }

      await recipe.deleteOne();
      return res.status(200).json({ message: "Recipe deleted successfully" });
    } catch {
      return res.status(500).json({ message: "Error deleting recipe" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
