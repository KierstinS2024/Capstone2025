// src/pages/api/recipes/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import Recipe from "@/models/Recipe";
import axios from "axios";

// This route handles listing all recipes or creating a new one
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // First, connect to my MongoDB database
  await connectToDatabase();

  // ===========================
  // GET: list recipes (with optional search)
  // ===========================
  if (req.method === "GET") {
    const { search } = req.query;

    try {
      // If the user provided a search term, check external APIs too
      if (search && typeof search === "string") {
        const query = encodeURIComponent(search);

        // Call Spoonacular API for recipe search
        const spoonacularApiKey = process.env.SPOONACULAR_API_KEY;
        let externalRecipes: any[] = [];

        if (spoonacularApiKey) {
          const response = await axios.get(
            `https://api.spoonacular.com/recipes/complexSearch?query=${query}&number=5&apiKey=${spoonacularApiKey}`
          );
          externalRecipes = response.data.results.map((r: any) => ({
            title: r.title,
            id: r.id,
            source: "Spoonacular"
          }));
        }

        // Also fetch matching recipes from my MongoDB
        const localRecipes = await Recipe.find({
          name: { $regex: search, $options: "i" }
        }).limit(10);

        return res.status(200).json({ localRecipes, externalRecipes });
      }

      // If no search term, just return all recipes from MongoDB
      const recipes = await Recipe.find().limit(20);
      return res.status(200).json({ recipes });

    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Error fetching recipes" });
    }
  }

  // ===========================
  // POST: create a new recipe
  // ===========================
  if (req.method === "POST") {
    try {
      // I need the user to be logged in
      const userId = verifyToken(req.headers.authorization);

      const { name, description, instructions, nutritionInfo, cuisine } = req.body;

      // Basic validation
      if (!name || !instructions) {
        return res.status(400).json({ message: "Recipe name and instructions are required" });
      }

      // I create a new recipe in MongoDB
      const newRecipe = await Recipe.create({
        name,
        description,
        instructions,
        nutritionInfo,
        cuisine,
        userSubmitted: true,
        createdByUserId: userId
      });

      return res.status(201).json({ recipe: newRecipe });
    } catch (err: any) {
      console.error(err);
      return res.status(401).json({ message: err.message });
    }
  }

  // Method not allowed for anything else
  return res.status(405).json({ message: "Method not allowed" });
}
