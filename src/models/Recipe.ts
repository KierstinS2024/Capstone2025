// src/models/Recipe.ts
// Add favorite field to Recipe schema

import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  source: string;
  favorite: boolean; // <--- new field
}

const recipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  source: { type: String, default: "local" },
  favorite: { type: Boolean, default: false }, // <--- default false
});

export const Recipe =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", recipeSchema);
