import mongoose, { Schema, Document } from "mongoose";

export interface NutritionSnapshot {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  [key: string]: number;
}

// Export the interface
export interface IFoodIntake extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId?: mongoose.Types.ObjectId;
  ingredientId?: mongoose.Types.ObjectId;
  date: Date;
  quantity: number;
  unit: string;
  nutritionSnapshot?: NutritionSnapshot;
  createdAt: Date;
  updatedAt: Date;
}

const FoodIntakeSchema = new Schema<IFoodIntake>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recipeId: { type: Schema.Types.ObjectId, ref: "Recipe" },
    ingredientId: { type: Schema.Types.ObjectId, ref: "Ingredient" },
    date: { type: Date, required: true, default: Date.now, index: true },
    quantity: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true },
    nutritionSnapshot: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

FoodIntakeSchema.index({ userId: 1, date: -1 });

FoodIntakeSchema.pre("validate", function (next) {
  if (!this.recipeId && !this.ingredientId)
    return next(new Error("Either recipeId or ingredientId is required"));
  if (this.recipeId && this.ingredientId)
    return next(new Error("Only one of recipeId or ingredientId can be set"));
  next();
});

// Default export for the model
const FoodIntakeModel =
  mongoose.models.FoodIntake ||
  mongoose.model<IFoodIntake>("FoodIntake", FoodIntakeSchema);

export default FoodIntakeModel;
