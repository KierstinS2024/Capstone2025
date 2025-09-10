// src/models/User.ts
// Mongoose schema and model for application users

import mongoose, { Schema, Document, Types } from "mongoose";
import type { Recipe } from "./Recipe";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  favorites: Types.ObjectId[]; // References Recipe._id
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true, select: false },
  name: { type: String, required: true },
  favorites: [{ type: Schema.Types.ObjectId, ref: "Recipe", default: [] }],
});

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
