import mongoose, { Schema, Document } from "mongoose";

export interface IRecipe extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  instructions: string;
  source: "local" | "spoonacular";
  spoonacularId?: number;
}

const RecipeSchema = new Schema<IRecipe>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  ingredients: [
    {
      name: String,
      quantity: String,
      unit: String,
    },
  ],
  instructions: { type: String, required: true },
  source: {
    type: String,
    enum: ["local", "spoonacular"],
    default: "local",
  },
  spoonacularId: { type: Number },
});

export default mongoose.models.Recipe ||
  mongoose.model<IRecipe>("Recipe", RecipeSchema);
