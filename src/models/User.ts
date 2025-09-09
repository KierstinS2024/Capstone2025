// path: src/models/User.ts
/**
 * User model
 * Stores user credentials, preferences, and avatar
 */
import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  preferences?: Record<string, any>;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    preferences: { type: Schema.Types.Mixed, default: {} },
    avatarUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<UserDocument>("User", UserSchema);
