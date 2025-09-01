// src/models/Recipe.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// TypeScript interface for a Recipe document
export interface IRecipe extends Document {
  name: string;
  description?: string;
  instructions: string[];
  nutritionInfo?: Record<string, any>; // calories, macros, etc.
  cuisine?: string;
  userSubmitted: boolean;
  createdByUserId?: mongoose.Types.ObjectId;
}

const RecipeSchema: Schema<IRecipe> = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  instructions: [{ type: String, required: true }],
  nutritionInfo: { type: Object },
  cuisine: { type: String },
  userSubmitted: { type: Boolean, default: false },
  createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
});

// Use existing model if it exists, otherwise create a new one
const Recipe: Model<IRecipe> =
  mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema);

export default Recipe;
