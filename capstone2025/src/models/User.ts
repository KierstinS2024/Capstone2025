// File: src/models/User.ts
// Purpose: Mongoose model for users
// Stores credentials, preferences, and optional avatar URL

import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript interface representing a User document in MongoDB
 */
export interface UserDocument extends Document {
  email: string; // User's unique email
  passwordHash: string; // Hashed password stored securely
  preferences?: Record<string, any>; // Optional: dietary restrictions, theme, etc.
  avatarUrl?: string; // Optional: URL to user avatar
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-updated timestamp
}

/**
 * Mongoose schema defining the structure of a User collection
 */
const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true, // Remove leading/trailing spaces
      lowercase: true, // Store email in lowercase
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
    },
    preferences: {
      type: Schema.Types.Mixed,
      default: {}, // Default empty preferences object
    },
    avatarUrl: {
      type: String,
      default: "", // Default to empty string if no avatar provided
    },
  },
  { timestamps: true } // Automatically add createdAt & updatedAt
);

/**
 * Export Mongoose model
 * Checks if model already exists (useful for hot reloads in development)
 */
export default mongoose.models.User ||
  mongoose.model<UserDocument>("User", UserSchema);
