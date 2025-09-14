// path: src/models/User.ts
import { Schema, model, models, type Document } from "mongoose";

// TypeScript interface for User documents
export interface IUser extends Document {
  email: string;
  name: string;
  password: string; // stored as hashed
  createdAt: Date;
  updatedAt: Date;
}

// User schema definition
const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    password: { type: String, required: true }, // store only hashed
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

// Export User model (reuse existing if already compiled)
export const User = models.User || model<IUser>("User", UserSchema);
