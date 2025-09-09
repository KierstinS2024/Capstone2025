// path: src/models/Saved.ts
/**
 * Saved.ts
 * ----------------------
 * Mongoose model for recipes a user has saved to their account (editable, internal only).
 * Supports optional linking to meal plans and storing user notes.
 */

import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISaved extends Document {
  userId: string; // ID of the user who saved the recipe
  recipeId: string; // ID of the internal recipe
  mealPlanIds?: string[]; // Optional array of linked meal plan IDs
  notes?: string; // Optional user notes
  createdAt: Date; // Timestamp of creation
  updatedAt: Date; // Timestamp of last update
}

const SavedSchema: Schema<ISaved> = new Schema(
  {
    userId: { type: String, required: true },
    recipeId: { type: String, required: true },
    mealPlanIds: [{ type: String }], // array of meal plan IDs, optional
    notes: { type: String },
  },
  { timestamps: true } // includes createdAt and updatedAt
);

export default mongoose.models.Saved ||
  mongoose.model<ISaved>("Saved", SavedSchema);
