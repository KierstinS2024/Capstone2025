// src/models/User.ts
import { Schema, model, models, Document, Types } from "mongoose";

// User document interface
export interface IUser extends Document {
  email: string;
  password: string; // hashed
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const User = models.User || model<IUser>("User", UserSchema);
export default User;
