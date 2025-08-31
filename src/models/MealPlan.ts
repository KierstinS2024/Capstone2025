//src/models/MealPlan.ts

import mongoose from 'mongoose';

// This is my MealPlan schema: it stores weekly meal plans for each user
const MealPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weekStartDate: Date,
  notes: String,
  entries: [
    {
      recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
      dayOfWeek: String, // 'Monday', 'Tuesday', etc.
      mealType: String, // 'breakfast', 'lunch', 'dinner', 'snack'
      servings: Number
    }
  ]
});

// I export the model to manage meal plans in my API
export default mongoose.models.MealPlan || mongoose.model('MealPlan', MealPlanSchema);
