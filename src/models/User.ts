// path: src/models/User.ts
/**
 * User model
 * Stores user credentials, preferences, and avatar
 */
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  preferences?: Record<string, any>; // e.g., dietary restrictions, favorite cuisines
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    preferences: { type: Schema.Types.Mixed, default: {} },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
