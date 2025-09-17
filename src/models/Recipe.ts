// ===========================================
// src/models/Recipe.ts
// ===========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  author?: string;
}

const RecipeSchema = new Schema<IRecipe>({
  title: { type: String, required: true },
  ingredients: [{ type: String }],
  instructions: { type: String },
  author: { type: String }, // user email
});

export default mongoose.models.Recipe ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
