// src/pages/api/ingredients/index.ts

import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/lib/db";
import Ingredient from "@/models/Ingredient";
import { verifyToken } from "@/lib/auth";

// This API route handles listing all ingredients (GET) and creating a new ingredient (POST)
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDatabase();

  // Handle GET request: list all ingredients
  if (req.method === "GET") {
    const ingredients = await Ingredient.find({});
    return res.status(200).json({ ingredients });
  }

  // Handle POST request: create a new ingredient
  if (req.method === "POST") {
    // I make sure the user is authenticated
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { name, unit, defaultQuantity, nutritionInfo } = req.body;

    if (!name) {
      return res
        .status(400)
        .json({ message: "Name is required for an ingredient" });
    }

    const newIngredient = await Ingredient.create({
      name,
      unit,
      defaultQuantity,
      nutritionInfo,
    });

    return res.status(201).json({ ingredient: newIngredient });
  }

  // Method not allowed
  return res.status(405).json({ message: "Method not allowed" });
}
