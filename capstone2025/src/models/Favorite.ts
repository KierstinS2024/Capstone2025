// path: src/models/Favorite.ts
/**
 * Favorite.ts
 * ----------------------
 * Mongoose model for storing user-saved recipes (favorites).
 * Each document links a user to a recipe (internal or external) they have favorited.
 */

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId; // Reference to the user
  recipe: mongoose.Types.ObjectId; // Reference to the recipe
  createdAt: Date;
}

const FavoriteSchema: Schema<IFavorite> = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipe: { type: Schema.Types.ObjectId, ref: "Recipe", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Unique compound index to prevent duplicates
FavoriteSchema.index({ user: 1, recipe: 1 }, { unique: true });

const FavoriteModel: Model<IFavorite> =
  mongoose.models.Favorite ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);

export default FavoriteModel;
