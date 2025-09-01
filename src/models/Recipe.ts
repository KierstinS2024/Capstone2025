// path: src/models/Recipe.ts
/**
 * Recipe model
 * Stores recipe details, ingredients, instructions, nutrition, and ownership
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  name: string;
  description: string;
  instructions: string[];
  cuisine?: string;
  userSubmitted: boolean;
  createdByUserId?: mongoose.Types.ObjectId; // references User
  ingredients: {
    ingredientId: mongoose.Types.ObjectId;
    quantity: number;
    unit: string;
  }[];
  nutritionInfo?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    instructions: { type: [String], default: [] },
    cuisine: { type: String },
    userSubmitted: { type: Boolean, default: false },
    createdByUserId: { type: Schema.Types.ObjectId, ref: "User" },
    ingredients: [
      {
        ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient", required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true },
      },
    ],
    nutritionInfo: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.models.Recipe || mongoose.model<IRecipe>("Recipe", RecipeSchema);
