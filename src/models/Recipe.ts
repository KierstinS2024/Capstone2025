// src/models/Recipe.ts
// Mongoose schema and model for recipes

import mongoose, { Schema, Document, Types } from "mongoose";
import type { IUser } from "./User";

export interface IRecipe extends Document {
  userId: Types.ObjectId | IUser;
  title: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string;
  source: "local" | "spoonacular";
  spoonacularId?: number;
}

const recipeSchema = new Schema<IRecipe>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: true },
      unit: { type: String, required: true },
    },
  ],
  instructions: { type: String, required: true },
  source: { type: String, enum: ["local", "spoonacular"], default: "local" },
  spoonacularId: { type: Number },
});

export const Recipe =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", recipeSchema);
