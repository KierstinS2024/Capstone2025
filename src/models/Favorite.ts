// path: src/models/Favorite.ts
/**
 * Favorite.ts
 * ----------------------
 * Mongoose model for storing user-saved recipes (favorites).
 * Each document links a user to a recipe (internal or external) they have favorited.
 */

import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: string; // ID of the user who favorited the recipe
  recipeId: string; // ID of the recipe (internal or external)
  createdAt: Date; // Timestamp when favorited
}

const FavoriteSchema: Schema<IFavorite> = new Schema(
  {
    userId: { type: String, required: true },
    recipeId: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);
