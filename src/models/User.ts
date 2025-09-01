// src/models/User.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// Interface representing a User document in MongoDB
export interface IUser extends Document {
  email: string;
  passwordHash: string;
  preferences: Record<string, any>;
  avatarUrl?: string;
}

const UserSchema: Schema<IUser> = new Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  preferences: { type: Object, default: {} },
  avatarUrl: { type: String },
});

// Use existing model if it exists, else create a new one
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
