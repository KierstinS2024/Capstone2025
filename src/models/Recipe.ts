// ===========================================
// src/models/Recipe.ts
// ===========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  author?: string; // user email
  temporary?: boolean;
  linkedMealPlanIds?: string[];
}

const RecipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: { type: String },
  author: { type: String }, // user email
  temporary: { type: Boolean, default: false },
  linkedMealPlanIds: [{ type: String }],
});

export default mongoose.models.Recipe ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
