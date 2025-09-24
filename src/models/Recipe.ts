// ===========================================
// PATH: src/models/Recipe.ts
// ===========================================
import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  ingredients: string[];
  instructions: string;
  image?: string;
  source: "user" | "spoonacular";
  author: string; // ✅ user email
  createdAt: Date;
  updatedAt: Date;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: { type: String, required: true },
    ingredients: { type: [String], default: [] },
    instructions: { type: String, default: "" },
    image: { type: String },
    source: { type: String, enum: ["user", "spoonacular"], default: "user" },
    author: { type: String, required: true }, // ✅ required now
  },
  { timestamps: true }
);

export default mongoose.models.Recipe ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
