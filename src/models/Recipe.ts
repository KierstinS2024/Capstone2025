// src/models/Recipe.ts
import { Schema, model, models, Document, Types } from "mongoose";

// Recipe document interface
export interface IRecipe extends Document {
  userId?: Types.ObjectId; // optional if user-saved
  name: string;
  image?: string;
  ingredients: string[];
  instructions: string;
  favorite?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    image: { type: String },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Recipe = models.Recipe || model<IRecipe>("Recipe", RecipeSchema);
export default Recipe;
